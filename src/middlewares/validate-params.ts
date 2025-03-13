import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { printError } from "../utils/logger";
import { toLowerCase } from "../utils/functions"; 
import { IResponse } from "../model";

class ValidateParams {
  async validate(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body) {
        req.body = toLowerCase(req.body);
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response: IResponse = {
          success: false,
          message: "Invalid params",
          data: errors.array(),
        };
        res.status(400).json(response);
        return;
      }
      next();
    } catch (error) {
      printError("Error validating params" + error);
      const response: IResponse = {
        success: false,
        message: "Error validating params",
        data: null,
      };
      res.status(500).json(response);
    }
  }
}

export default new ValidateParams();
