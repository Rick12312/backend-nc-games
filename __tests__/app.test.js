const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("200: Returns array of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories.length).toEqual(4);
        res.body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200: Returns a review given a review_id", () => {
    return request(app)
      .get("/api/reviews/4")
      .expect(200)
      .then((res) => {
        expect(res.body.review).toMatchObject({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: 4,
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String),
        });
      });
  });
  test("400: Throws 400 error when passed an invalid ID", () => {
    return request(app)
      .get("/api/reviews/not-a-id")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("404: Non-existent ID eg 0 or 9999", () => {
    return request(app).get("/api/reviews/9999").expect(404);
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("200: Returns updated review", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body.review.review_id).toBe(1);
        expect(res.body.review.votes).toBe(2);
      });
  });
  test("400: Error - Missing required fields, passed an empty object as the res body", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual("Bad Request");
      });
  });
  test("400: Status 400, invalid ID, e.g. string of not-an-id", () => {
    return request(app)
      .patch("/api/reviews/not-an-id")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual("Bad Request");
      });
  });
  test("404: Non existent ID, e.g. 0 or 9999", () => {
    return request(app)
      .patch("/api/reviews/9999")
      .send({ inc_votes: 1 })
      .expect(404);
  });
});

describe("GET /api/reviews", () => {
  test("200: Returns an array of reviews", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toHaveLength(13);
        res.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: default sort & order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: Accepts sort by column query", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("200: Accepts order by query, defaults to DESC when no order is passed", () => {
    return request(app)
      .get("/api/reviews?order=ASC")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSorted({ descending: false });
      });
  });
  test("200: Takes a category query and filters the result to show only reviews for this category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then((res) => {
        res.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            category: "dexterity",
          });
        });
      });
  });
  test("400: invalid sort_by query, ?sort_by=bananas", () => {
    return request(app)
      .get("/api/reviews?sort_by=bananas")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("400: invalid order_by query, ?order=bananas", () => {
    return request(app)
      .get("/api/reviews?order=bananas")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("404: non-existent category query, ?category=bananas`", () => {
    return request(app).get("/api/reviews?category=bananas").expect(404);
  });
  test("200. valid `category` query, but has no reviews responds with an empty array of reviews, ?category=children's games", () => {
    return request(app)
      .get("/api/reviews?category=children%27s+games")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toEqual([]);
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: Should return an array comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((res) => {
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            review_id: 2,
            created_at: expect.any(String),
            comment_id: expect.any(Number),
          });
        });
        expect(res.body.comments).toHaveLength(3);
      });
  });
  test("400: Invalid ID, e.g. string of not-an-id", () => {
    return request(app)
      .get("/api/reviews/not-an-id/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("404: Non existent ID, e.g. 0 or 9999", () => {
    return request(app).get("/api/reviews/9999/comments").expect(404);
  });
  test("200: Valid ID, but has no comments responds with an empty array of comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toHaveLength(0);
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("201: Returns an object with username / body properties", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .expect(201)
      .send({ username: "philippaclaire9", body: "Test body" })
      .then((res) => {
        expect(res.body.comment.author).toEqual("philippaclaire9");
        expect(res.body.comment.body).toEqual("Test body");
      });
  });
  test('400: Invalid ID, e.g. string of "not-an-id"', () => {
    return request(app)
      .post("/api/reviews/not-an-id/comments")
      .expect(400)
      .send({ username: "philippaclaire9", body: "Test body" })
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("404: Non existent ID, e.g. 0 or 9999", () => {
    return request(app)
      .post("/api/reviews/9999/comments")
      .send({ username: "philippaclaire9", body: "Test body" })
      .expect(404);
  });
  test("400: Missing required field(s), e.g. no username or body properties", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .expect(400)
      .send({ body: "Test Body" })
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("404: Username does not exist ", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .expect(404)
      .send({ username: "Ron", body: "test body" });
  });
  test("201: Ignores unnecessary properties", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .expect(201)
      .send({ username: "philippaclaire9", body: "test body", votes: 10 })
      .then((res) => {
        expect(res.body.comment.votes).toBe(0);
      });
  });
});

describe("GET /api", () => {
  test("200: Responds with a list of available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        res.body.endpoints.forEach((endpoint) => {
          expect(endpoint).toMatchObject({
            url: expect.any(String),
            method: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: Non existant ID, e.g 999", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Non existant ID");
      });
  });
  test('400: invalid ID, e.g "not-an-id"', () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid ID");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Returns an array of users with property username", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        res.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
          });
        });
        expect(res.body.users).toHaveLength(4);
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Returns a user object when passed username", () => {
    return request(app)
      .get("/api/users/philippaclaire9")
      .expect(200)
      .then((res) => {
        expect(res.body.user).toMatchObject({
          username: "philippaclaire9",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          name: "philippa",
        });
      });
  });

  test('400: When passed an incorrect username returns 400 with msg of "Bad Request"', () => {
    return request(app)
      .get("/api/users/not-a-username")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("404: Non existant ID, e.g 999", () => {
    return request(app).get("/api/users/999").expect(404);
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Returns a comment object by ID with updated votes property", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body.comment.votes).toBe(14);
      });
  });
  test('400: Invalid ID, e.g. string of "not-an-id"', () => {
    return request(app)
      .patch("/api/comments/not-an-id")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("404: Non existent ID, e.g. 0 or 9999", () => {
    return request(app)
      .patch("/api/comments/9999")
      .send({ inc_votes: 1 })
      .expect(404);
  });
  test("400: Missing / incorrect body, e.g. `inc_votes` property is not a number, or missing", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "string" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
});
