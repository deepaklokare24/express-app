const fs = require('fs');

exports.getTourById = (req, tours) => {
  const id = req.params.id * 1;
  return tours.find((item) => item.id === id);
};

exports.updateToursSourceFile = (filename, tours, newTour, res) => {
  fs.writeFile(filename, JSON.stringify(tours), (err) => {
    if (err) res.status(500).send(`Internal server error! \n ${err.message}`);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};
