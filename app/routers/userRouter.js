const debug = require('debug')('opet:userRouter');

const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const controllerHandler = require('../controllers/controllerHandler');

const validate = require('../validations/validator');
const { post: userPostSchema } = require('../validations/schemas/user.schema');
const { get: userGetSchema } = require('../validations/schemas/user.schema');
const { put: userPutSchema } = require('../validations/schemas/user.schema');

const authenticateToken = require('../middlewares/authenticateToken');

/**
 * a general User type
 *
 * @typedef {object} User
 * @property {number} id - user id
 * @property {string} first_name - user's first_name
 * @property {string} last_name - user's last_name
 * @property {string} email - user's email adress
 * @property {string} password - user's encrypted password
 * @property {string} postal_code - user's postal code (adress)
 * @property {string} city - user's city (adress)
 * @property {string} presentation - user's presentation
 * @property {boolean} availability - user's availability (if role petsitter)
 * @property {string} availability_details - user's availability details (if role petsitter)
 * @property {boolean} rgpd_consent - 'true' if user's rgpd_consent is accepted / 'false'
 * @property {string} rgpd_consent_date - date of rgpd_consent
 * @property {string} created_at - date of creation
 * @property {string} updated_at - date of last update
 */

/**
 * a get User type
 *
 * @typedef {object} UserGet
 * @property {number} id - user id
 * @property {string} first_name - user's first_name
 * @property {string} last_name - user's last_name
 * @property {string} email - user's email adress
 * @property {string} postal_code - user's postal code (adress)
 * @property {string} city - user's city (adress)
 * @property {string} presentation - user's presentation
 * @property {boolean} availability - user's availability (if role petsitter)
 * @property {string} availability_details - user's availability details (if role petsitter)
 * @property {array<UserRole>} roles - array of user's roles (id and name)
 * @property {array<UserPetType>} roles - array of user's pet_types (id and name) if role petsitter
 * @property {array<UserPet>} pets - array of user's pets (id, name, pet_type name, presentation)
 * @property {array<UserAd>} ads - array of user's ads (id, city, title, content)
 * @property {string} created_at - date of creation
 * @property {string} updated_at - date of last update
 * @property {boolean} isOwner - isOwner:true (added if loggedIn user wants its own profile page)
 */

/**
 * a get User type for available petsitters
 *
 * @typedef {object} UserResearched
 * @property {number} id - user id
 * @property {string} first_name - user's first_name
 * @property {string} last_name - user's last_name
 * @property {string} email - user's email adress
 * @property {string} postal_code - user's postal code (adress)
 * @property {string} city - user's city (adress)
 * @property {string} presentation - user's presentation
 * @property {boolean} availability - user's availability = true
 * @property {string} availability_details - user's availability details (if role petsitter)
 * @property {string} role_name - role_name = petsitter
 * @property {array<string>} pet_types - array of user's pet_type names
 * @property {string} created_at - date of creation
 * @property {string} updated_at - date of last update
 */

/**
 * a post User type
 *
 * @typedef {object} UserPost
 * @property {string} first_name - user's first_name
 * @property {string} last_name - user's last_name
 * @property {string} email - user's email adress
 * @property {string} password - user's password
 * @property {string} confirmPassword - user's password confirmation
 * @property {string} postal_code - user's postal code (adress)
 * @property {string} city - user's city (adress)
 * @property {boolean} role_petowner - 'true' if user's role is petowner / 'false'
 * @property {boolean} role_petsitter - 'true' if user's role is petsitter / 'false'
 * @property {string} availability - user's availability 'true'/'false'(if role petsitter)
 * @property {string} availability_details - user's availability details (if role petsitter)
 * @property {array<string>} pet_type - array of user's pet_type id
 * @property {boolean} rgpd_consent - 'true' if user's rgpd_consent is accepted / 'false'
 * @property {boolean} cgu_consent - 'true' if user's cgu_consent is accepted / 'false'
 */

/**
 * a put User type
 *
 * @typedef {object} UserPut
 * @property {string} first_name - user's first_name
 * @property {string} last_name - user's last_name
 * @property {string} email - user's email adress
 * @property {string} presentation - user's presentation
 * @property {string} postal_code - user's postal code (adress)
 * @property {string} city - user's city (adress)
 * @property {boolean} role_petowner - 'true' if user's role is petowner / 'false'
 * @property {boolean} role_petsitter - 'true' if user's role is petsitter / 'false'
 * @property {string} availability - user's availability 'true'/'false'(if role petsitter)
 * @property {string} availability_details - user's availability details (if role petsitter)
 * @property {array<string>} pet_type - array of user's pet_type id
 */

/**
 * a User created type
 *
 * @typedef {object} UserCreated
 * @property {number} id - user id
 * @property {string} first_name - user's first_name
 * @property {string} last_name - user's last_name
 * @property {string} email - user's email adress
 * @property {string} postal_code - user's postal code (adress)
 * @property {string} city - user's city (adress)
 * @property {string} presentation - user's presentation
 * @property {array<number>} roles - array of user's roles id
 * @property {array<number>} pet_type - array of user's pet_type id
 * @property {boolean} availability - user's availability (if role petsitter)
 * @property {string} availability_details - user's availability details (if role petsitter)
 * @property {boolean} rgpd_consent - 'true' if user's rgpd_consent is accepted / 'false'
 * @property {string} rgpd_consent_date - date of rgpd_consent
 * @property {string} created_at - date of creation
 * @property {string} updated_at - date of last update
 */

/**
 * an User updated type
 *
 * @typedef {object} UserUpdated
 * @property {number} id - user id
 * @property {string} first_name - user's first_name
 * @property {string} last_name - user's last_name
 * @property {string} email - user's email adress
 * @property {string} postal_code - user's postal code (adress)
 * @property {string} city - user's city (adress)
 * @property {string} presentation - user's presentation
 * @property {array<number>} roles - array of user's roles id
 * @property {array<number>} pet_type - array of user's pet_type id
 * @property {boolean} availability - user's availability (if role petsitter)
 * @property {string} availability_details - user's availability details (if role petsitter)
 * @property {string} created_at - date of creation
 * @property {string} updated_at - date of last update
 * @property {array<number>} roles - array of user's roles id
 * @property {array<number>} pet_type - array of user's pet_type id
 * @property {array<UserPet>} pets - array of user's pets (id, name, pet_type name, presentation)
 * @property {array<UserAd>} ads - array of user's ads (id, city, title, content)
 */

/**
 * a UserRole type
 *
 * @typedef {object} UserRole
 * @property {number} id - role id
 * @property {string} name - role name
 */

/**
 * a UserPet type
 *
 * @typedef {object} UserPet
 * @property {number} id - pet id
 * @property {string} name - pet's name
 * @property {string} pet_type - pet's pet_type name
 * @property {string} presentation - pet's presentation
 */

/**
 * a UserAd type
 *
 * @typedef {object} UserAd
 * @property {number} id - ad id
 * @property {string} city - ad's city
 * @property {string} title - ad's title
 * @property {string} content - ad's content
 */

/**
 * a UserPetType type
 *
 * @typedef {object} UserPetType
 * @property {number} id - pet_type id
 * @property {string} name - pet_type name
 */

/**
 * a UserReqQuery type : to filter by department & pet_type
 *
 * @typedef {object} UserReqQuery
 * @property {string} department - number of the department (to filter)
 * @property {string} pet_type - pet_type name (to filter)
 */

/**
 * GET /users/{userId}
 *
 * @summary get user by its id
 * @tags Users
 *
 * @param {number} userId.path - user id
 *
 * @return {UserGet} 200 - success response
 * @return {object} 500 - internal server error
 * @return {object} 401 - unauthorized
 * @return {object} 403 - forbidden
 *
 * @security BearerAuth
 */
userRouter.get('/users/:id([0-9]+)', authenticateToken, controllerHandler(userController.getOneUser));

/**
 * PUT /users/{userId}
 *
 * @summary modify a user by its id
 * @tags Users
 *
 * @param {number} userId.path - user id
 * @param {UserPut} request.body - user to modify
 *
 * @return {UserUpdated} 200 - success response
 * @return {object} 500 - internal server error
 * @return {object} 401 - unauthorized
 * @return {object} 403 - forbidden
 *
 * @security BearerAuth
 */
userRouter.put('/users/:id([0-9]+)', authenticateToken, validate(userPutSchema, 'body'), controllerHandler(userController.modifyUser));

/**
 * DELETE /users/{userId}
 *
 * @summary delete a user by its id
 * @tags Users
 *
 * @param {number} userId.path - user id
 *
 * @return {object} 204 - success response
 * @return {object} 500 - internal server error
 *
 * @security BearerAuth
 */
userRouter.delete('/users/:id([0-9]+)', authenticateToken, controllerHandler(userController.deleteUser));

/**
 * GET /users
 *
 * @summary get all users who are available petsitters (filtered by department and pet_type)
 * @tags Users
 *
 * @param {UserReqQuery} request.query - department number & pet_type name
 * to filter available petsitters
 *
 * @return {array<UserResearched>} 200 - success response
 * @return {object} 500 - internal server error
 */
userRouter.get('/users', validate(userGetSchema, 'query'), controllerHandler(userController.getSearchResults));

/**
 * POST /users
 *
 * @summary create a user
 * @tags Users
 *
 * @param {UserPost} request.body - user
 *
 * @return {UserUpdated} 200 - success response
 * @return {object} 500 - internal server error
 * @return {object} 400 - bad request
 */
userRouter.post('/users', validate(userPostSchema, 'body'), controllerHandler(userController.createUser));

module.exports = userRouter;
