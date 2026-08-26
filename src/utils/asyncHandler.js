/**
 * Higher-order wrapper function to catch async errors and pass them to next() middleware
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
