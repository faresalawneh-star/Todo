function Pagination({ page, nextPage, previousPage, onPageChange }) {
  return (
    <div>
      <button
        disabled={!previousPage}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      <span style={{ margin: "0 12px" }}>Page {page}</span>

      <button
        disabled={!nextPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;