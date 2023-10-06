import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chaiHttp from "chai-http";
import app from "../../../src/app";
import { mockData } from "../mocks/dataMock";
import fs from "fs";
import jsonHelper from "../../../src/utils/readJsonFile";

chai.use(sinonChai);
chai.use(chaiHttp);

describe(`csv.route`, () => {
  afterEach(function () {
    sinon.restore();
  });

  describe(`save`, () => {
    it("when a valid body is passed should return status 200 with an text and the data", async () => {
      const response = await chai
        .request(app)
        .post(`/api/files`)
        .set("Content-Type", "text/csv")
        .attach(
          "file",
          fs.readFileSync("./tests/test-uploads/Settings_202310051429.csv"),
          "Settings_202310051429.csv"
        );

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal({
        message: "CSV file uploaded and processed successfully",
        data: mockData,
      });
    });

    it("when the body is not passed should return status 400 with an text 'No file uploaded'", async () => {
      const response = await chai.request(app).post(`/api/files`);

      expect(response.status).to.be.equal(400);
      expect(response.body).to.be.deep.equal({
        message: "No file uploaded",
      });
    });

    it("when a valid body is passed, but there is a problem parsing the file should return status 500 with an text 'Failed to save the file'", async () => {
      const writeFileStub = sinon.stub(fs, "writeFile");
      writeFileStub.callsArgWith(2, new Error());

      const response = await chai
        .request(app)
        .post(`/api/files`)
        .set("Content-Type", "text/csv")
        .attach(
          "file",
          "./tests/test-uploads/Settings_202310051429.csv",
          "Settings_202310051429.csv"
        );

      expect(response.status).to.be.equal(500);
      expect(response.body).to.be.deep.equal({
        message: "Failed to save the file",
      });

      writeFileStub.restore();
    });
  });

  describe("search", () => {
    it("When searchParams is undefined or equal to empty string, should returned status 200 and all fields of the csv file", async () => {
      const readJsonFileStub = sinon.stub(jsonHelper, "readJsonFile");
      readJsonFileStub.resolves(mockData);

      const response = await chai.request(app).get(`/api/users`);

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal({
        data: mockData,
      });

      readJsonFileStub.restore();
    });

    it("When searchParams is passed, should returned status 200 and all fields of the csv file thats includes searchParams", async () => {
      const readJsonFileStub = sinon.stub(jsonHelper, "readJsonFile");
      readJsonFileStub.resolves(mockData);

      const response = await chai
        .request(app)
        .get(`/api/users`)
        .query({ q: "call" });

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal({
        data: [mockData[0]],
      });

      readJsonFileStub.restore();
    });

    it("When have some problem, should returned status 500 and text 'Ops.. maybe we have some problems'", async () => {
      const readJsonFileStub = sinon.stub(jsonHelper, "readJsonFile");
      readJsonFileStub.callsArgWith(2, new Error());

      const response = await chai
        .request(app)
        .get(`/api/users`)
        .query({ q: "call" });

      expect(response.status).to.be.equal(500);
      expect(response.body).to.be.deep.equal({
        message: "Ops.. maybe we have some problems",
      });
    });
  });
});
