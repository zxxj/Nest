import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get('testQuery')
  query(@Query('address') address: string, @Query('age') age: number) {
    console.log(address);
    return `参数是 address:${address}, age: ${age}`;
  }

  @Get(':username')
  urlParam(@Param('username') username: string) {
    console.log(username);
    return `参数是:${username}`;
  }

  @Post()
  formUrlencodedAndJson(@Body() createPersonDto: CreatePersonDto) {
    return `参数是: ${JSON.stringify(createPersonDto)}`;
  }

  @Post('file')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads',
    }),
  )
  upload(
    @Body() createPersonDto: CreatePersonDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(files);
    return `参数是:${JSON.stringify(createPersonDto)}`;
  }
}
