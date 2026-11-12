import {
  ApiErrorCode,
  ApiResult,
  Organization,
} from "@enterprise-flow/contracts";
import { OrganizationService } from "@enterprise-flow/core";
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
} from "@nestjs/common";
import { CreateOrganizationDto } from "./dto/create-organization.dto.js";

const ERROR_STATUS: Record<ApiErrorCode, HttpStatus> = {
  VALIDATION_ERROR: HttpStatus.BAD_REQUEST,
  UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
  FORBIDDEN: HttpStatus.FORBIDDEN,
  NOT_FOUND: HttpStatus.NOT_FOUND,
  CONFLICT: HttpStatus.CONFLICT,
  INTERNAL_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
};

@Controller("organizations")
export class OrganizationsController {
  constructor(
    @Inject(OrganizationService)
    private readonly organizationService: OrganizationService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateOrganizationDto,
  ): Promise<ApiResult<Organization>> {
    const result = await this.organizationService.create(dto);

    return this.handleResult(result);
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<ApiResult<Organization>> {
    const result = await this.organizationService.findById(id);

    return this.handleResult(result);
  }

  private handleResult<T>(result: ApiResult<T>): ApiResult<T> {
    if (!result.success) {
      throw new HttpException(result, ERROR_STATUS[result.error.code]);
    }

    return result;
  }
}
