import css from './Button.module.css';

export const LoadButton = ({ LoadMore }) => {
  return (
    <button onClick={LoadMore} className={css.Button} type="button">
      Load more
    </button>
  );
};
