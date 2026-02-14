import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { upvotePost } from '../api/client';
import styles from './LocalPostCard.module.css';

export default function LocalPostCard({ post, onUpvoted }) {
  const { user } = useAuth();
  const [upvoting, setUpvoting] = useState(false);
  const [upvotes, setUpvotes] = useState(post.upvotes ?? 0);
  const [voted, setVoted] = useState(false);

  const handleUpvote = async () => {
    if (!user) return;
    if (voted || upvoting) return;
    setUpvoting(true);
    try {
      await upvotePost(post._id);
      setUpvotes((v) => v + 1);
      setVoted(true);
      onUpvoted?.();
    } catch (_) {}
    finally {
      setUpvoting(false);
    }
  };

  const preview = post.content?.length > 120 ? post.content.slice(0, 120) + '…' : post.content;

  return (
    <article className={styles.card}>
      <span className={styles.badge}>{post.postType}</span>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.content}>{preview}</p>
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.upvoteBtn}
          onClick={handleUpvote}
          disabled={!user || voted || upvoting}
          title={!user ? 'Login to upvote' : ''}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
          <span>{upvotes}</span>
        </button>
        {post.userId?.name && (
          <span className={styles.author}>{post.userId.name}</span>
        )}
      </div>
    </article>
  );
}
