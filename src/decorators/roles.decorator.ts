import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/typings/types";

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);