import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Feedback } from 'src/feedback/persistence/feedback.entity';
import { PermissionsGuard } from 'src/permissions/permission.guard';
import { PaginatedResultsDto } from 'src/shared/pagination/paginated-results-dto';
import { PaginationDto } from '../../shared/pagination/pagination-dto';
import { Permissions } from '../../permissions/permission.decorator';
import { MyfeedbackpalService } from '../services/myfeedbackpal.service';
import { Auth0UserModel } from '../../shared/model/auth0.user.model';
import { MyFeedbacksDto } from '../dtos/get.myfeedbacks.dto';

@Controller('myFeedbackpal')
export class MyfeedbackpalController {
  constructor(private myFeedbackService: MyfeedbackpalService) {}

  @Get('/myFeedbacks')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:feedbackEvents')
  async getAllUserFeedBacks(
    @Query()
    params,
    @Req() request: any
  ): Promise<PaginatedResultsDto<MyFeedbacksDto>> {
    const { user } = request;
    const paginationDto: PaginationDto = params;
    if (!user) {
      throw new UnauthorizedException('Unauthorised to perform this request');
    }
    return await this.myFeedbackService.getAllUserFeedback(
      user.sub,
      paginationDto
    );
  }
}
