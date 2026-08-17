const Service = require("../models/service");

exports.getServices = (req, res, next) => {
  Service.fetchAll((services) => {
    res.render('host/services', {
      services: services,
      pageTitle: "Manage Services"
    });
  });
};

exports.getAddService = (req, res, next) => {
  res.render('host/add-service', {
    pageTitle: "Add Service",
    service: null
  });
};

exports.postAddService = (req, res, next) => {
  const { name, category, tagline, price, unit, badge, icon, features } = req.body;

  const service = new Service(name, category, tagline, price, unit, badge, icon, features);

  service
    .save()
    .then(() => {
      res.redirect('/services');
    })
    .catch((err) => {
      console.log('ERROR saving service:', err);
      res.redirect('/services/add');
    });
};

exports.getEditService = (req, res, next) => {
  const serviceId = req.params.serviceId;
  Service.findById(serviceId, (service) => {
    if (!service) {
      return res.status(404).render('error', { pageTitle: "Service Not Found" });
    }
    res.render('host/add-service', {
      pageTitle: "Edit Service",
      service: service
    });
  });
};

exports.postEditService = (req, res, next) => {
  const serviceId = req.params.serviceId;
  const { name, category, tagline, price, unit, badge, icon, features } = req.body;

  const updatedData = {
    name: name,
    category: category,
    tagline: tagline,
    price: Number(price) || 0,
    unit: unit,
    badge: badge || null,
    icon: icon || '✦',
    features: (features || '').split('\n').map((f) => f.trim()).filter(Boolean)
  };

  Service.updateById(serviceId, updatedData, () => {
    res.redirect('/services');
  });
};

exports.postDeleteService = (req, res, next) => {
  const serviceId = req.params.serviceId;
  Service.deleteById(serviceId, () => {
    res.redirect('/services');
  });
};
