import clsx from "clsx";

function Pagination({ total = 100, page = 0, size = 10, onPageClick }) {
  return (
    <div className="flex justify-center">
      {new Array(Math.round(total / size)).fill(undefined).map((_, i) => (
        <span
          onClick={() => {
            onPageClick && onPageClick(i);
          }}
          key={i}
          className={clsx(
            "mx-1  text-blue-500 hover:text-blue-600 hover:underline cursor-pointer",
            { "font-bold": page == i }
          )}
        >
          {i}
        </span>
      ))}
    </div>
  );
}

export default Pagination;
