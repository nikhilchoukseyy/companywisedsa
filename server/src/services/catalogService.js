const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const DATA_DIR = path.join(__dirname, '../../data');
const INDEX_PATH = path.join(DATA_DIR, 'index.json');

let catalogCache = null;

function normalizeLink(link) {
  return (link || '').trim().replace(/\/+$/, '');
}

function createQuestionId(link, title) {
  const normalizedLink = normalizeLink(link);
  if (normalizedLink) {
    try {
      const url = new URL(normalizedLink);
      const slug = url.pathname
        .split('/')
        .filter(Boolean)
        .pop();

      if (slug) {
        return slug.toLowerCase();
      }
    } catch (error) {
      return normalizedLink.toLowerCase();
    }
  }

  return String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toDifficultyKey(value) {
  return String(value || '').toUpperCase();
}

function createDifficultyCounter() {
  return {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  };
}

function incrementDifficulty(counter, difficulty) {
  if (counter[difficulty] !== undefined) {
    counter[difficulty] += 1;
  }
}

function loadCatalog() {
  if (catalogCache) {
    return catalogCache;
  }

  const companyIndex = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
  const companies = Object.keys(companyIndex).sort();
  const questionsById = new Map();
  const companyStats = new Map();

  companies.forEach((company) => {
    const csvPath = path.join(DATA_DIR, company, '5. All.csv');
    if (!fs.existsSync(csvPath)) {
      return;
    }

    const rows = parse(fs.readFileSync(csvPath, 'utf8'), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const questionIds = [];
    const difficultyCounts = createDifficultyCounter();

    rows.forEach((row) => {
      const questionId = createQuestionId(row.Link, row.Title);
      const difficulty = toDifficultyKey(row.Difficulty);
      const topics = String(row.Topics || '')
        .split(',')
        .map((topic) => topic.trim())
        .filter(Boolean);

      questionIds.push(questionId);
      incrementDifficulty(difficultyCounts, difficulty);

      if (!questionsById.has(questionId)) {
        questionsById.set(questionId, {
          id: questionId,
          title: row.Title,
          difficulty,
          link: normalizeLink(row.Link),
          topics,
          companies: [company],
        });
      } else {
        const current = questionsById.get(questionId);
        if (!current.companies.includes(company)) {
          current.companies.push(company);
        }
      }
    });

    companyStats.set(company, {
      company,
      totalQuestions: questionIds.length,
      difficultyCounts,
      questionIds,
    });
  });

  catalogCache = {
    companies,
    questionsById,
    companyStats,
    totalUniqueQuestions: questionsById.size,
  };

  return catalogCache;
}

function buildUserDashboard(user) {
  const catalog = loadCatalog();
  const solvedSet = new Set(user.solvedQuestionIds || []);
  const bookmarkedSet = new Set(user.bookmarkedQuestionIds || []);
  const overallDifficultyTotals = createDifficultyCounter();
  const solvedDifficultyTotals = createDifficultyCounter();
  const solvedQuestions = [];
  const bookmarkedQuestions = [];

  for (const question of catalog.questionsById.values()) {
    incrementDifficulty(overallDifficultyTotals, question.difficulty);
    if (solvedSet.has(question.id)) {
      incrementDifficulty(solvedDifficultyTotals, question.difficulty);
      solvedQuestions.push(question);
    }
    if (bookmarkedSet.has(question.id)) {
      bookmarkedQuestions.push(question);
    }
  }

  const companyProgress = catalog.companies.map((company) => {
    const companyEntry = catalog.companyStats.get(company);
    if (!companyEntry) {
      return {
        company,
        totalQuestions: 0,
        solvedQuestions: 0,
        remainingQuestions: 0,
        completionPercentage: 0,
        difficultyTotals: createDifficultyCounter(),
        difficultySolved: createDifficultyCounter(),
      };
    }

    const solvedCountByDifficulty = createDifficultyCounter();
    let solvedQuestionsCount = 0;

    companyEntry.questionIds.forEach((questionId) => {
      if (solvedSet.has(questionId)) {
        solvedQuestionsCount += 1;
        const question = catalog.questionsById.get(questionId);
        incrementDifficulty(solvedCountByDifficulty, question?.difficulty);
      }
    });

    return {
      company,
      totalQuestions: companyEntry.totalQuestions,
      solvedQuestions: solvedQuestionsCount,
      remainingQuestions: Math.max(companyEntry.totalQuestions - solvedQuestionsCount, 0),
      completionPercentage:
        companyEntry.totalQuestions === 0
          ? 0
          : Math.round((solvedQuestionsCount / companyEntry.totalQuestions) * 100),
      difficultyTotals: companyEntry.difficultyCounts,
      difficultySolved: solvedCountByDifficulty,
    };
  });

  const recentActivity = (user.solvedActivity || []).slice(0, 10).map((activity) => {
    const question = catalog.questionsById.get(activity.questionId);

    return {
      questionId: activity.questionId,
      solvedAt: activity.solvedAt,
      title: question?.title || activity.questionId,
      difficulty: question?.difficulty || '',
      companies: question?.companies || [],
      link: question?.link || '',
    };
  });

  return {
    totals: {
      solvedQuestions: solvedSet.size,
      bookmarkedQuestions: bookmarkedSet.size,
      totalUniqueQuestions: catalog.totalUniqueQuestions,
      remainingQuestions: Math.max(catalog.totalUniqueQuestions - solvedSet.size, 0),
      completionPercentage:
        catalog.totalUniqueQuestions === 0
          ? 0
          : Math.round((solvedSet.size / catalog.totalUniqueQuestions) * 100),
      difficultyTotals: overallDifficultyTotals,
      difficultySolved: solvedDifficultyTotals,
    },
    solvedQuestions: solvedQuestions.sort((a, b) => a.title.localeCompare(b.title)),
    bookmarkedQuestions: bookmarkedQuestions.sort((a, b) => a.title.localeCompare(b.title)),
    companyProgress,
    recentActivity,
  };
}

module.exports = {
  createQuestionId,
  loadCatalog,
  buildUserDashboard,
};
