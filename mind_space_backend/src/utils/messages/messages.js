const generateMessages = (entity) => ({
  notFound: `${entity} not found`,
  alreadyExists: `${entity} already exists`,
  createdSuccessfully: `${entity} created successfully`,
  updatedSuccessfully: `${entity} updated successfully`,
  deletedSuccessfully: `${entity} deleted successfully`,
  failCreate: `fail to create ${entity}`,
  failUpdate: `fail to update ${entity}`,
  failDelete: `fail to delete ${entity}`,
  alreadyExists: `${entity} already exists`,
});

export const messages = {
  user: {
    ...generateMessages("user"),
    invalidEorP: "invalid email or password",
    login: "login successfully",
  },
  users: generateMessages("users"),
  message: generateMessages("message"),
  messages: generateMessages("messages"),
  otp: generateMessages("otp"),
  article: generateMessages("article"),
  comment: generateMessages("comment"),
  pfp: generateMessages("profile picture"),
  feedback: generateMessages("feedback"),
  test: generateMessages("test"),
  questions: generateMessages("questions"),
  question: generateMessages("question"),
  answer: generateMessages("answer"),
};
