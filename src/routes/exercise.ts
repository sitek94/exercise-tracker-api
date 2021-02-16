import { Router } from 'express';
import User from '../models/user';
import { Exercise } from '../models/exercise';
import { ValidatedRequest } from 'express-joi-validation';
import validator, {
  AddRequestSchema,
  addSchema,
  LogRequestSchema,
  logSchema,
} from '../middleware/validator';

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
      throw new Error('Username taken');
    }

    // Create new user
    const user = new User({ username });

    // Save the user
    await user.save();

    res.json(user);
  } catch (e) {
    // res.json({ error: e.message });
    res.status(400).json({ error: e.message });
  }
});

/**
 * Adds new exercise in the database.
 */
router.post(
  '/add',
  validator.body(addSchema),
  async (req: ValidatedRequest<AddRequestSchema>, res) => {
    const { userId, description, duration, date } = req.body;

    try {
      // Create date object
      const dateObj = date ? new Date(date) : new Date();

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
      res.status(400).json({ error: e.message });
    }
  },
);

/**
 * Returns user's log object
 */
router.get(
  '/log',
  validator.query(logSchema),
  async (req: ValidatedRequest<LogRequestSchema>, res) => {
    const { userId, from, to, limit } = req.query;

    try {
      // Find the user by id
      const user = await User.findOne({ _id: userId });

      // User not found
      if (!user) throw new Error(`User not found`);

      interface Query {
        userId: string;
        date?: {
          $gte?: Date;
          $lte?: Date;
        };
      }

      const query: Query = { userId };

      // Optionally add "from" and "to" filters
      if (from || to) query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);

      // Find all user exercises
      const exercises = await Exercise.find(query, null, {
        limit,
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
      return res.status(400).json({ error: e.message });
    }
  },
);

export default router;
