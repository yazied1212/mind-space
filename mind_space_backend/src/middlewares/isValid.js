import joi from "joi";

export const isValid = (schema) => {
  return (req, res, next) => {
    try {
      const data = { ...req.body, ...req.params, ...req.query };
      if (req.file || req.files) {
        data.attachments = req.file || req.files;
      }

      const result = schema.validate(data, { abortEarly: false });

      if (result.error) {
        let messages = result.error.details.map((obj) => obj.message);
        return next(new Error(messages, { cause: 400 }));
      }

      return next();
    } catch (error) {
      return next(new Error(error.message));
    }
  };
};

//general field
export const generaleField = {
  id: joi.string().hex().length(24),
  attachments: joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().required(),
  }),
};
