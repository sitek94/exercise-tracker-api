import { Router, Request, Response } from 'express';
import { User } from '../models/user';
import { Exercise } from '../models/exercise';
import { body, query, validationResult } from 'express-validator';
import { validDateRe } from '../utils/valid-date-regex';

const router = Router();

/**
 * Returns array of all users
 */
router.get('/users', async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();

    res.json(users);
  } catch (e) {
    res.json({ error: e.message });
  }
});

/**
 * Adds new user in the database.
 */
router.post('/new-user', async (req, res) => {
  const { username } = req.body;

  try {
    // Check user in the database
    const existingUser = await User.findOne({ username });

    // User already exists
    if (existingUser) {
      res.json({ error: 'User with that name already exists' });
    }

    // Create new user
    const user = new User({ username });

    // Save the user
    await user.save();

    res.json(user);
  } catch (e) {
    res.json({ error: e.message });
  }
});

/**
 * Adds new exercise in the database.
 */
router.post(
  '/add',
  body(['userId', 'description']).notEmpty(),
  body('duration').notEmpty().isInt(),
  body('date').matches(validDateRe).optional({ checkFalsy: true }),
  async (req: Request, res: Response) => {
    // Check if body is empty
    if (!req.body) {
      return res.json({ error: 'Body cannot be empty' });
    }

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }

    const userId: string = req.body.userId;
    const description: string = req.body.description;
    const duration = Number(req.body.duration);
    const date = req.body.date;

    // Create date object
    const dateObj = date ? new Date(date.split('-')) : new Date();

    try {
      // Find the user by id
      const user = await User.findOne({ _id: userId });

      // User not found
      if (!user) throw new Error(`User not found`);

      // Create new exercise
      const exercise = new Exercise({
        userId,
        description,
        duration,
        date: dateObj,
      });

      // Save the exercise
      await exercise.save();

      // Send user object and exercise details
      res.json({
        // User object
        _id: user._id,
        username: user.username,

        // Exercise details
        description,
        duration,
        date: dateObj.toDateString(),
      });
    } catch (e) {
      res.json({ error: e.message });
    }
  },
);

/**
 * Returns user's log object
 */
router.get(
  '/log',
  query('userId').notEmpty(),
  query(['from', 'to']).matches(validDateRe).optional({ nullable: true }),
  query('limit').isInt().optional({ nullable: true }),
  async (req, res) => {
    // Validate query parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }

    try {
      if (!req.query) throw new Error('userId is required');

      const { userId } = req.query;

      // Find user by id
      const user = await User.findOne({ _id: userId });

      // User not found
      if (!user) {
        return res.json({ error: 'Uknown user' });
      }

      // Optional parameters
      const { from, to, limit } = req.query;

      const fromDate = from ? new Date(from.split('-')) : undefined;
      const toDate = to ? new Date(to.split('-')) : undefined;
      const limitNumber = limit ? Number(limit) : undefined;

      interface DateQuery {
        $gt?: Date;
        $lt?: Date;
      }

      interface Query {
        userId: string;
        date?: DateQuery;
      }

      const dateQuery: DateQuery = {};

      // Optionally construct date query
      if (fromDate) dateQuery.$gt = fromDate;
      if (toDate) dateQuery.$lt = toDate;

      // Initial query, userId is required
      const query: Query = { userId };

      // Append date queries (if any)
      if (Object.keys(dateQuery).length) {
        query.date = dateQuery;
      }

      // Find all user exercises
      const exercises = await Exercise.find(query, null, {
        limit: limitNumber,
      });

      // Construct exercises log array
      const exercisesLog = exercises.map(({ description, duration, date }) => ({
        description,
        duration,
        date: date.toDateString(),
      }));

      // Send log object
      return res.json({
        _id: userId,
        username: user.username,
        count: exercises.length,
        log: exercisesLog,
      });
    } catch (e) {
      return res.json({ error: e.message });
    }
  },
);

export default router;
