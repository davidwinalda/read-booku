import React from 'react';

import styles from './BookHighlight.module.css'

interface Props {
  id: number
  src: string
  alt: string
  title: string
  authors: string[]
  description: string
  widthCover: string
}

const BookHighlight: React.FC<Props> = ({ src, alt, title, authors, description, widthCover }) => {
  return (
    <div>
      <img src={src} alt={alt} width={widthCover} />
      <h3>{title}</h3>
      {
        authors &&
        authors.map((author, idx) => (
          <span key={idx}>{author}</span>
        ))
      }
      <p className={styles.desc}>{description}</p>
    </div>
  );
}

export default BookHighlight;