import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  // describe("Deployment", function () {});
  describe("Create", function () {
    it("Should revert if options param array doesn't have at least 1 element", async function () {
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(this.signers[2].address, 100, [])
      ).to.be.revertedWithCustomError(
        this.jobManager,
        `DCAOptions__InvalidOptions`
      );
    });
    it("Should revert if owner is zero address", async function () {
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(ethers.constants.AddressZero, 100, [0])
      ).to.be.revertedWithCustomError(
        this.jobManager,
        `JobManager__InvalidOwner`
      );
    });
    it("Should revert if amount is <= 0", async function () {
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(this.signers[1].address, 0, [0])
      ).to.be.revertedWithCustomError(
        this.jobManager,
        `JobManager__InvalidAmount`
      );
    });
    it("Should create job if validation successful", async function () {
      const _investmentAmount = 100;
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(this.signers[1].address, _investmentAmount, [0])
      ).to.not.be.reverted;
    });
    it("Should get zero active jobIds", async function () {
      const _jobIds = await this.jobManager.getActiveJobIds();
      expect(_jobIds).to.be.a("array");
      expect(_jobIds.length).to.be.equal(0);
    });
    it("Should return false from isValidId", async function () {
      expect(await this.jobManager.isValidId(0)).to.be.equal(false);
    });
    describe("Events", function () {
      it("Should emit event during create", async function () {
        await expect(
          this.jobManager
            .connect(this.signers[0])
            .create(this.signers[2].address, 100, [0])
        ).to.emit(this.jobManager, `LogCreate`);
      });
    });
    describe("...after job1 created", function () {
      beforeEach(`...create job1`, async function () {
        this._investmentAmount = 100;
        await this.jobManager
          .connect(this.signers[0])
          .create(this.signers[1].address, this._investmentAmount, [0]);
      });
      it("Should update _s_numActiveJobs var", async function () {
        expect(await this.jobManager._s_numActiveJobs()).to.be.equal(1);
      });
      it("Should have updated jobIds counter after create", async function () {
        expect(await this.jobManager.getCurrentId()).to.be.equal(1);
      });
      it("Should have updated s_jobs var after create", async function () {
        const _job = await this.jobManager.s_jobs(0);
        expect(_job.id).to.be.equal(0);
        expect(_job.owner).to.be.equal(this.signers[1].address);
        expect(_job.frequencyOptionId).to.be.equal(0);
        expect(_job.isActive).to.be.equal(true);
        expect(_job.startTime).to.be.equal(await time.latest());
        expect(_job.investmentAmount).to.be.equal(this._investmentAmount);
      });
      it("Should get active jobIds", async function () {
        const _jobIds = await this.jobManager.getActiveJobIds();
        const jobIdsValues = _jobIds.map((e: any) => e.toNumber());
        expect(_jobIds).to.be.an("array");
        expect(_jobIds.length).to.be.equal(1);
        expect(jobIdsValues).to.be.an("array").that.includes(0);
        expect(await this.jobManager.isValidId(0)).to.be.equal(true);
      });
      describe("...after job2 created", function () {
        beforeEach(`...create job2`, async function () {
          this._investmentAmount = 200;
          await this.jobManager
            .connect(this.signers[0])
            .create(this.signers[3].address, this._investmentAmount, [0]);
        });
        it("Should update _s_numActiveJobs var", async function () {
          expect(await this.jobManager._s_numActiveJobs()).to.be.equal(2);
        });
        it("Should get getActiveJobIds", async function () {
          const _jobIds = await this.jobManager.getActiveJobIds();
          const jobIdsValues = _jobIds.map((e: any) => e.toNumber());
          expect(_jobIds).to.be.an("array");
          expect(_jobIds.length).to.be.equal(2);
          expect(jobIdsValues).to.be.an("array").that.includes(1);
          expect(await this.jobManager.isValidId(1)).to.be.equal(true);
        });
        it("Should have updated s_jobs var after create2", async function () {
          const _job = await this.jobManager.s_jobs(1);
          expect(_job.id).to.be.equal(1);
          expect(_job.owner).to.be.equal(this.signers[3].address);
          expect(_job.frequencyOptionId).to.be.equal(0);
          expect(_job.isActive).to.be.equal(true);
          expect(_job.startTime).to.be.equal(await time.latest());
          expect(_job.investmentAmount).to.be.equal(this._investmentAmount);
        });
      });
      describe("Cancel", function () {
        it("Should revert if no active job exists", async function () {
          await expect(this.jobManager.cancel(5)).to.be.reverted;
        });
        it("Should not revert if validation succeeds", async function () {
          await expect(this.jobManager.cancel(0)).to.not.be.reverted;
          const _job = await this.jobManager.s_jobs(0);
          expect(_job.isActive).to.be.equal(false);
          expect(await this.jobManager._s_numActiveJobs()).to.be.equal(0);
        });

        describe("Events", function () {
          it("Should emit event during cancel", async function () {
            await expect(this.jobManager.connect(this.signers[0]).cancel(0))
              .to.emit(this.jobManager, `LogCancelJob`)
              .withArgs(0);
          });
        });
        // describe("...After job1 is cancelled", function () {
        //   beforeEach(`...cancel job1`, async function () {

        //   });
        //   it("Should update _s_numActiveJobs var", async function () {

        //   });
        // });
      });
    });
  });
  // describe("Cancel existing DCA job", function () {
  //   it("Should revert if user has no active job", async function () {});
  //   it("Should delete the DCA job if validation successful", async function () {});
  //   describe("...After DCA job cancelled", function () {
  //     it("Should show state of user's funds and DCA job details", async function () {});
  //   });
  //   describe("Events", function () {
  //     it("Should emit event when DCA job is cancelled", async function () {});
  //   });
  // });
};
