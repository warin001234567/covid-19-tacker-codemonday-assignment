const globalFunc = {
  // add comma to number
  numberWithCommas: (x) => {
    if (x !== 0) return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "unreported";
  },
};

export default globalFunc;
