var Channel = require('../models/Channel');
var bodyparser = require('body-parser');

module.exports = function (router) {
    router.use(bodyparser.json());

    // deprecating this route since it just gets all channels
    router.get('/channels', function (req, res) {

        Channel.find({}, null, function (err, data) {
            if (err) {
                console.log(err);
                return res.status(500).json({msg: 'internal server error'});
            }

            res.json(data);
        });
    });

    // this route returns all channels including private channels for that user
    //   {name: 1, id:1, private: 1, between: 1, _id:0, caseDescription: 1, caseLocation: 1, efForce: 1, approved: 1}
    router.get('/channels/:name', function (req, res) {
        Channel.find({$or: [{between: req.params.name}, {private: false}]}, null, function (err, data) {
            if (err) {
                console.log(err);
                return res.status(500).json({msg: 'internal server error'});
            }
            res.json(data);
        });
    });

    // post a new user to channel list db
    router.post('/channels/new_channel', function (req, res) {
        var newChannel = new Channel(req.body);
        newChannel.save(function (err, data) {
            if (err) {
                console.log(err);
                return res.status(500).json({msg: 'internal server error'});
            }
            res.json(data);
        });
    });

    router.post('channels/:name/approve', function (req, res) {

    });
}
