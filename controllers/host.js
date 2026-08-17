const Homes = require("../models/home");
const Favourite = require("../models/favourite");

exports.getBooking = (req, res, next) => {
  res.render('store/bookings',{ pageTitle: "about us" });
} 

exports.getfavouriteList = (req, res, next) => {
  Favourite.fetchAll((favouriteIds) => {
    Homes.fetchAll((services) => {
      const favouriteHomes = services.filter((home) => favouriteIds.includes(home.id));
      res.render('store/favourite-list', { services: favouriteHomes , pageTitle: "explore our plans" });
    });
  });
};

exports.postfavouriteList = (req, res, next) => {
  const homeId = req.body.homeId;
  Favourite.addById(homeId, () => {
    console.log("Added to favourites:", homeId);
    res.redirect('/favourite-list');
  });
};

// exports.deleteFavourite = (req, res, next) => {
//   const homeId = req.body.homeId;
//   Favourite.deleteById(homeId, () => {
//     console.log("Removed from favourites:", homeId);
//     res.redirect('/favourite-list');
//   });
// };
 

// exports.getreserve = (req, res, next) => {
//   res.render('store/reserve',{ pageTitle: "Reserve" });
// } 
exports.gethostHomes = (req, res, next) => {
  const services = (require("../models/home")).fetchAll((services) => {
    console.log(services);
    res.render('host/host-home', { services: services , pageTitle: "host Homes" });
  }); };

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Homes.findById(homeId, (home) => {
    if (!home) {
      return res.status(404).render('error', { pageTitle: "Home Not Found" });
    }
    res.render('host/edit', { home: home, pageTitle: "Edit Home" });
  });
};

exports.postEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const { homeaddress, price, location, ratings, image } = req.body;
  Homes.updateById(homeId, { homeaddress, price, location, ratings, image }, () => {
    console.log("Home updated:", homeId);
    res.redirect('/host-home');
  });
};

exports.getDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Homes.findById(homeId, (home) => {
    if (!home) {
      return res.status(404).render('error', { pageTitle: "Home Not Found" });
    }
    res.render('host/delete', { home: home, pageTitle: "Delete Home" });
  });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Homes.deleteById(homeId, () => {
    console.log("Home deleted:", homeId);
    Favourite.deleteById(homeId, () => {
      res.redirect('/host-home');
    });
  });
};

  exports.gethomedetails = (req, res, next) => {

    res.render('store/home-details', { pageTitle: "contact us" });  
  }

