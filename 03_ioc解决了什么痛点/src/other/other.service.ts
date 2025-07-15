import { Injectable } from '@nestjs/common';

@Injectable()
export class OtherService {
  test() {
    return 'other-test';
  }
}
