import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { LocationService } from 'app/entities/location/location.service';
import { ILocation, Location } from 'app/shared/model/location.model';
import { CountryEnum } from 'app/shared/model/enumerations/country-enum.model';

describe('Service Tests', () => {
  describe('Location Service', () => {
    let injector: TestBed;
    let service: LocationService;
    let httpMock: HttpTestingController;
    let elemDefault: ILocation;
    let expectedResult: ILocation | ILocation[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(LocationService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Location(
        0,
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        CountryEnum.USA,
        'AAAAAAA',
        0,
        0,
        currentDate,
        'AAAAAAA',
        currentDate,
        'AAAAAAA'
      );
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            createdOn: currentDate.format(DATE_TIME_FORMAT),
            updatedOn: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Location', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            createdOn: currentDate.format(DATE_TIME_FORMAT),
            updatedOn: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdOn: currentDate,
            updatedOn: currentDate,
          },
          returnedFromService
        );

        service.create(new Location()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Location', () => {
        const returnedFromService = Object.assign(
          {
            address: 'BBBBBB',
            streetAddress: 'BBBBBB',
            city: 'BBBBBB',
            stateProvince: 'BBBBBB',
            country: 'BBBBBB',
            postalCode: 'BBBBBB',
            latitude: 1,
            longitude: 1,
            createdOn: currentDate.format(DATE_TIME_FORMAT),
            createdBy: 'BBBBBB',
            updatedOn: currentDate.format(DATE_TIME_FORMAT),
            updatedBy: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdOn: currentDate,
            updatedOn: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Location', () => {
        const returnedFromService = Object.assign(
          {
            address: 'BBBBBB',
            streetAddress: 'BBBBBB',
            city: 'BBBBBB',
            stateProvince: 'BBBBBB',
            country: 'BBBBBB',
            postalCode: 'BBBBBB',
            latitude: 1,
            longitude: 1,
            createdOn: currentDate.format(DATE_TIME_FORMAT),
            createdBy: 'BBBBBB',
            updatedOn: currentDate.format(DATE_TIME_FORMAT),
            updatedBy: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdOn: currentDate,
            updatedOn: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Location', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
