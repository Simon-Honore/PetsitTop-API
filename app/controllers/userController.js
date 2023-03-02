/* eslint-disable camelcase */
const debug = require('debug')('opet:userController');
const bcrypt = require('bcrypt');

const userDataMapper = require('../models/userDataMapper');

const userController = {

  async getAllUsers(request, response) {
    debug('getAllUsers');
    const users = await userDataMapper.findAllUsers();
    response.status(200).json(users);
  },
  async getSearchResults(request, response) {
    debug('getSearchResults');
    const { department, pet_type: petType } = request.query;
    const users = await userDataMapper.findAllAvailablePetsittersFilter(department, petType);
    response.status(200).json(users);
  },

  async getOneUser(request, response) {
    debug('getOneUser');
    const searchedId = Number(request.params.id);

    let user = await userDataMapper.findUserById(searchedId);

    // On enlève le password de l'objet user
    const { password, ...userWithoutPwd } = user;

    // Si l'user est connecté, on ajoute une propriété isOwner à l'objet user
    const loggedInUser = request.user;
    debug('loggedInUser :', loggedInUser);
    if (Number(searchedId) === loggedInUser.id) {
      user = { userWithoutPwd, isOwner: true };
    }
    response.status(200).json(userWithoutPwd);
  },

  async createUser(request, response, next) {
    debug('createUser');
    const { body } = request;

    // Test si email existe déjà
    const isExistingUser = await userDataMapper.findUserByEmail(body.email);
    if (isExistingUser) {
      const error = { statusCode: 400, message: 'Email is already exists' };
      return next(error);
    }

    // Hash le password de l'user avec Bcrypt
    // doc: https://www.npmjs.com/package/bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    // on remplace le password en clair par le 'hashé' pour le stockage en DB:
    body.password = hashedPassword;

    // Security: we remove the confirmPassword (not hashed) from request.body to prevent data leaks:
    const { confirmPassword, ...bodySafe } = body;

    const user = await userDataMapper.createUser(bodySafe);

    // On enlève le password de l'objet user
    const { password, ...userWithoutPwd } = user;

    // debug(user);
    return response.status(201).json(userWithoutPwd);
  },

  async modifyUser(request, response, next) {
    debug('modifyUser');
    const { id } = request.params;

    // Test si l'user a le droit d'accéder à cette route
    const loggedInUser = request.user;
    debug('loggedInUser :', loggedInUser);
    if (Number(id) !== loggedInUser.id) {
      const error = { statusCode: 403, message: 'Forbidden' };
      return next(error);
    }

    // Etat actuel de l'user (avant modification)
    const userBeforeSave = await userDataMapper.findUserWithRoleAndPetTypeById(id);
    debug('userbeforeSave :', userBeforeSave);
    // Si la modification de l'user n'a aucun role, on renvoie une erreur
    const { role_petsitter, role_petowner } = request.body;
    if
    (
      (role_petsitter === 'false' && role_petowner === 'false')
      && (userBeforeSave.role_names.includes('petowner') || userBeforeSave.role_names.includes('petsitter'))
    ) {
      const error = { statusCode: 400, message: 'Au moins un rôle est requis' };
      return next(error);
    }

    // Test si l'email existe déjà (si l'email a été modifié)
    const { email } = request.body;
    debug(email);
    // Si l'email a été modifié
    if (email !== userBeforeSave.email) {
      const emailAlreadyExists = await userDataMapper.findUserByEmail(email);
      if (emailAlreadyExists) {
        const error = { statusCode: 400, message: 'Email is already exists' };
        return next(error);
      }
    }

    // On modifie l'user avec les nouvelles données
    const user = await userDataMapper.modifyUser(id, request.body, userBeforeSave);

    // On enlève le password de l'objet user
    const { password, ...userWithoutPwd } = user;

    return response.status(200).json(userWithoutPwd);
  },

  async deleteUser(request, response, next) {
    debug('deleteUserById');
    const { id } = request.params; // id of the user to delete

    // If the ad does not exist, we return an error 404
    const isExistingUser = await userDataMapper.findUserById(id);
    if (!isExistingUser) {
      debug(`User ${id} does not exists`);
      return next();
    }

    // Test if the user has the right to access this route
    const loggedInUser = request.user;
    // If the "ad"."user_id" is different from "loggedInUser"."id", we return an error 403
    if (loggedInUser.id !== isExistingUser.id) {
      const error = { statusCode: 403, message: 'Forbidden' };
      return next(error);
    }

    // Delete the ad
    await userDataMapper.deleteUserById(id);

    // Response
    return response.status(204).send();
  },
};

module.exports = userController;
