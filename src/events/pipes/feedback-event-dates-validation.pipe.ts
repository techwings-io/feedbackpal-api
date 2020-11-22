import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import * as moment from 'moment';

export class FeedbackEventDatesValidationPipe implements PipeTransform {
  transform(value: any) {
    let { validFrom, validTo } = value;

    if (!validFrom) validFrom = '1970-01-01T00:00:00.000Z';
    if (!validTo) validTo = 8640000000000000;
    const dateFrom = moment(validFrom);
    const dateTo = moment(validTo);

    if (!dateFrom.isValid() || !dateTo.isValid()) {
      throw new BadRequestException(
        `Date from and Date to must be valid ISO 8601 format dates. Example: 2020-01-01T00:00:00.000Z`
      );
    }

    if (dateTo.isBefore(dateFrom)) {
      throw new BadRequestException(
        `The Date From must be earlier or equal to the Date To`
      );
    }

    return value;
  }
}
