import OSS from 'ali-oss';
import UUID from 'readableuuid';

let directory = '';
let publicLink = '';

export interface AnyObject {
    [key: string]: any;
}

let client: OSS;

interface Config {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: string;
    bucket: string;
    directory?: string;
    publicLink?: string;
}
export const configure = (config: Config): void => {
    client = new OSS({
        accessKeyId: config.accessKeyId,
        accessKeySecret: config.accessKeySecret,
        endpoint: config.endpoint,
        bucket: config.bucket,
    });
    if (config.directory) {
        directory = config.directory;
    }
    if (config.publicLink) {
        publicLink = config.publicLink;
    }
}

export const setData = async (content: string | AnyObject): Promise<{ uuid: string; url: string }> => {
    if (!client) {
        throw new OssNotConfiguredException('You need to config oss-temp first');
    }
    const uuid = UUID();
    await client.put(
        `${directory}/${uuid}`,
        Buffer.from(typeof content === 'object' ? JSON.stringify(content) : content),
        {
            mime: typeof content === 'object' ? 'application/json' : 'text/plain; charset=utf-8',
        },
    );
    return {
        uuid,
        url: `${publicLink}/${uuid}`,
    };
}

class OssTempNotFoundException extends Error {

}
class OssTempJsonParseException extends Error {

}
class OssNotConfiguredException extends Error {

}

export const getData = async (uuidOrLink: string): Promise<string | AnyObject> => {
    if (!client) {
        throw new OssNotConfiguredException('You need to config oss-temp first');
    }
    const uuid = uuidOrLink.replace(`${publicLink}/`, '');
    const res = await client.get(`${directory}/${uuid}`);
    if (!res || !res.content) {
        throw new OssTempNotFoundException('404 Not Found');
    }
    const content = res.content.toString();
    // @ts-ignore
    const contentType = res.res.headers['content-type'];
    if (contentType === 'application/json') {
        try {
            return JSON.parse(res.content.toString());
        } catch (e) {
            throw new OssTempJsonParseException(e.message);
        }
    }
    return content;
}
