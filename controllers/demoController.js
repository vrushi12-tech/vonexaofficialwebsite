const Demo = require("../models/demo");

exports.getDemos = (req, res, next) => {
  Demo.fetchAll((demos) => {
    res.render('demos', {
      demos: demos,
      pageTitle: "Vonexa | Our Work"
    });
  });
};

exports.getManageDemos = (req, res, next) => {
  Demo.fetchAll((demos) => {
    res.render('host/manage-demos', {
      demos: demos,
      pageTitle: "Manage Demos"
    });
  });
};

exports.postAddDemo = (req, res, next) => {
  const { title, description, imageUrl, link, videoUrl } = req.body;

  const demo = new Demo(title, description, imageUrl, link, videoUrl);

  demo
    .save()
    .then(() => {
      res.redirect('/manage-demos');
    })
    .catch((err) => {
      console.log('ERROR saving demo:', err);
      res.redirect('/manage-demos');
    });
};

exports.postDeleteDemo = (req, res, next) => {
  Demo.deleteById(req.params.demoId, () => {
    res.redirect('/manage-demos');
  });
};