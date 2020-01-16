const Like = require('./model');

const likes = new Like();

async function getLikesFromCurrentUser(request, response) {
  const id = request.decoded.userid;
  try {
    const call = await likes.getBy('likingUser', id);
    response.status(200).json(call);
  } catch (err) {
    console.log(err);
    response.status(206).send(err);
  }
}

async function likeUnlikeUserId(request, response) {
  const likingUser = request.decoded.userid;
  const likedUser = parseInt(request.params.id, 10);
  try {
    const alreadyLiked = await likes.exists(likingUser, likedUser);
    if (alreadyLiked) {
      const query = await likes.delete(likingUser, likedUser);
      if (query.unmatch) {
        // delete match
      }
    } else {
      const query = await likes.create(likingUser, likedUser);
      if (query.match) {
        // create match
      }
    }
    response.status(200).json(query);
  } catch (err) {
    console.log(err);
    response.status(206).send(err);
  }
}

module.exports.getLikesFromCurrentUser = getLikesFromCurrentUser;
module.exports.likeUnlikeUserId = likeUnlikeUserId;