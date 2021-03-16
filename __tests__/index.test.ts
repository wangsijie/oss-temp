import { setData, getData, AnyObject, configure } from '../src/index';

const config = {
    accessKeyId: '************H5Z7',
    accessKeySecret: '*************',
    endpoint: 'oss-cn-shanghai.aliyuncs.com',
    bucket: 'wangsijie-static',
    directory: '/oss-temp-test',
    publicLink: 'https://wangsijie-static.oss-cn-shanghai.aliyuncs.com',
}

describe('plain text', () => {
    let res = { uuid: '', url: '' };
    beforeAll((done) => {
        configure(config);
        setData('Hello World!').then(data => {
            res = data;
            done();
        })
    })

    test('uuid and url', () => {
        expect(typeof res.uuid).toBe('string');
    })

    test('getData and check', (done) => {
        getData(res.uuid).then(data => {
            expect(data).toBe('Hello World!');
            done();
        });
    })
})

describe('json', () => {
    let res = { uuid: '', url: '' };
    const sample = {
        foo: 'bar',
    };
    beforeAll((done) => {
        configure(config);
        setData(sample).then(data => {
            res = data;
            done();
        })
    })

    test('uuid and url', () => {
        expect(typeof res.uuid).toBe('string');
    })

    test('getData and check', (done) => {
        getData(res.uuid).then((data) => {
            const returnData: AnyObject = data as AnyObject;
            expect(returnData.foo).toBe('bar');
            done();
        });
    })
})
