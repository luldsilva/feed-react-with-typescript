import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChangeEvent, FormEvent, InvalidEvent, useState } from "react";
import { Avatar } from "./Avatar";
import { Comment } from "./Comment";
import styles from "./Post.module.css";

interface Author{
  name: string;
  role: string;
  avatarUrl: string;
}

interface Content {
  type: string;
  content: string;
}

interface PostProps{
  author: Author;
  publishedAt: Date;
  content: Content[];
}


export function Post({author, publishedAt, content}:PostProps) {
  const [comment, setComment] = useState([""]);
  const [newCommentText, setNewCommentText] = useState("");
  const publishedDateFormatted = format(
    publishedAt,
    "dd 'de' LLLL 'às' HH:mm'h'",
    {
      locale: ptBR,
    }
  );
  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  function handleCreateNewComment(event: FormEvent) {
    event.preventDefault();

    setComment([...comment, newCommentText]);
    setNewCommentText("");
  }

  function handleNewComment(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity("");
    setNewCommentText(event.target.value);
  }

  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity("Esse campo é obrigatório!");
  }

  function deleteComment(commentToDelete: string) {
    console.log("Entrou no deleteComment");
    const commentsWithoutDeleted = comment.filter((com) => {
      return com !== commentToDelete;
    });
    setComment(commentsWithoutDeleted);
  }

  const isNewCommentEmpty = newCommentText.length === 0;
  return (
    <article className={styles.post}>
      <header className={styles.mainHeader}>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} alt=""/>
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time
          title={publishedDateFormatted}
          dateTime={publishedAt.toISOString()}
        >
          {publishedDateRelativeToNow}
        </time>
      </header>
      <div className={styles.content}>
        {content.map((line) => {
          if (line.type === "paragraph") {
            return <p key={line.content}>{line.content}</p>;
          } else if (line.type === "link") {
            return (
              <p key={line.content}>
                👉 <a href="#">{line.content}</a>
              </p>
            );
          }
        })}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe aqui seu feedback</strong>
        <textarea
          name="comment"
          placeholder="Deixe um comentario"
          value={newCommentText}
          onChange={handleNewComment}
          onInvalid={handleNewCommentInvalid}
          required
        />
        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>
            Publicar
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comment.map((comment) => {
          return (
            <Comment
              key={comment}
              content={comment}
              onDeleteComment={deleteComment}
            />
          );
        })}
      </div>
    </article>
  );
}
