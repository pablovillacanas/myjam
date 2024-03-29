// Display list of all BookInstances.
const knex = require('../../db/knex')
const sessionService = require('../services/sessionService')(knex)
const socket = require('../ws/sockets').socket

exports.findAll_session = function (req, res) {
	sessionService.findAll().then((sessions) => res.send(sessions))
};

exports.get_session = function (req, res) {
	sessionService.findOneWithTracks({ id: req.params.session_id })
		.then((session) => session ? res.send(session) : res.status(404).send())
		.catch(e => res.status(500).send(e))
};

exports.create_session = function (req, res) {
	sessionService.create(req.body)
		.then(() => res.status(201).send())
		.catch(e => {
			res.status(500).send()
		})
};

exports.vote_track = function (req, res) {
	sessionService.incrementVotesBy1(req.params.session_id, req.params.track_id)
		.then((track) => {
			socket.emit(`votes/${req.params.session_id}`, track[0])
			res.status(204).send()
		})
		.catch(e => {
			res.status(500).send()
		})
};

exports.post_trackIntoSession = function (req, res) {
	sessionService.insertTrackIntoSession(req.params.session_id, req.body)
		.then((track) => {
			socket.emit(`tracks/${req.params.session_id}`, req.body)
			res.status(204).send()
		})
		.catch(e => {
			res.status(500).send()
		})
};