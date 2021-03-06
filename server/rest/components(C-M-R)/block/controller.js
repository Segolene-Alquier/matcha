const Block = require('./model');

const blocks = new Block();

async function blockUnblockUserId(request, response) {
  const blockingUser = request.decoded.userid;
  const blockedUser = parseInt(request.params.id, 10);
  if (blockedUser === blockingUser) {
    return response
      .status(200)
      .json({ success: false, error: 'You can not block yourself!' });
  }
  try {
    const alreadyBlocked = await blocks.exists(blockingUser, blockedUser);
    let query;
    if (alreadyBlocked) {
      query = await blocks.delete(blockingUser, blockedUser);
    } else {
      query = await blocks.create(blockingUser, blockedUser);
    }
    return response.status(200).json(query);
  } catch (err) {
    if (process.env.VERBOSE === 'true') console.log(err);
    return response.status(206).send(err);
  }
}

module.exports.blockUnblockUserId = blockUnblockUserId;
