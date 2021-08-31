

'use strict';

const Controller = require('egg').Controller;
const path = require('path');


const { exec } = require('child_process');


class updateFile extends Controller {

    async index() {

        let { ctx } = this;
        let parts = ctx.multipart();
        let part;

        while ((part = await parts()) != null) {
            if (part.length) {
                console.log('field: ' + part[0]);
                console.log('value: ' + part[1]);
                console.log('valueTruncated: ' + part[2]);
                console.log('fieldnameTruncated: ' + part[3]);
            } else {
                if (!part.filename) {
                    // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
                    // 需要做出处理，例如给出错误提示消息
                    return;
                }

                // part 是上传的文件流
                // console.log('field: ' + part.fieldname);
                // console.log('filename: ' + part.filename);
                // console.log('encoding: ' + part.encoding);
                // console.log('mime: ' + part.mime);

                // let file = {};
                // file.name = part.filename;


                const target = path.join(path.resolve(), `../update.tar.gz`);//文件路径
                global.Helper.File.ensurePath(target);
                await global.Helper.Stream.savefileAsyc(part, target);




                // 输出当前目录（不一定是代码所在的目录）下的文件和文件夹
                exec(`cd .. &&start autoupdate.bat`, (err, stdout, stderr) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    //console.log(stdout);
                    console.log(`stdout: \r\n${stdout}`);
                    // console.log(`stderr: ${stderr}`);
                })

                ctx.body="upload ok";
                return;
            }
        }

        ctx.body="upload fail";

    }
}
module.exports = updateFile;