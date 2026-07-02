import { useEffect } from 'react';

export default function PageSeo({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (!description) {
      return undefined;
    }

    let metaTag = document.querySelector('meta[name="description"]');

    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'description');
      document.head.appendChild(metaTag);
    }

    metaTag.setAttribute('content', description);

    return undefined;
  }, [description, title]);

  return null;
}
