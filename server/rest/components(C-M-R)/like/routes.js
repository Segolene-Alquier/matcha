const express = require('express');
const { checkToken } = require('../../middleware/jwt');

const router = express.Router();
const {
  // getLikesByLikingUserId,
  // getLikesByLikedUserId,
  getLikesFromCurrentUser,
  likeUnlikeUserId,
} = require('./controller');

// get the list of Like from the current user
router.get('/', checkToken, getLikesFromCurrentUser);
router.get('/like-unlike/:id', checkToken, likeUnlikeUserId);
// router.get('/:id', checkToken, getLikesByLikedUserId);
// router.get('/:id', checkToken, getLikesByLikingUserId);
module.exports = router;
