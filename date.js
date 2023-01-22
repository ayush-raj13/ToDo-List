exports.date = () => {
    const date = new Date();
    const options = {
        weekday: "long",
        month: "short",
        day: "numeric",
      };

    return date.toLocaleDateString("en-US", options);
}

exports.day = () => {
    const date = new Date();
    const options = {
        weekday: "long",
      };

    return date.toLocaleDateString("en-US", options);
}