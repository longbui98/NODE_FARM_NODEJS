const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const tourRouter = express.Router();

tourRouter.use("/:tourId/reviews", reviewRouter);

// tourRouter.param("id", tourController.checkID);
tourRouter.route("/top-5-cheap")
    .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter.route("/tour-stats").get(tourController.getTourStats);

tourRouter.route("/monthly-plan/:year").get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan);

tourRouter.route("/")
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour
    );

tourRouter.route("/:id")
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour
    );
module.exports = tourRouter;