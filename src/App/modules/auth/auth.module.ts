import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { EmployeeModule } from "../employee/employee.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AtStrategy, RtStrategy } from "./strategies";

@Global()
@Module({
  imports: [JwtModule.register({}), EmployeeModule],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
