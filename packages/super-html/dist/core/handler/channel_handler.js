"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jszip = __importStar(require("jszip"));
const utils_1 = __importDefault(require("../common/utils"));
const config_1 = __importDefault(require("../config/config"));
const platform_1 = __importDefault(require("../common/platform"));
class channel_handler {
    async run() {
        const s_out_dir = config_1.default.s_out_dir;
        const d_hot = config_1.default.d_hot;
        // #### 资源 
        //导入不带压缩的资源
        const s_res_body = `window.__res=${JSON.stringify(d_hot.d_res_cache)};`;
        // #### 带压缩的资源
        let s_zip_res_body = "";
        {
            //导入带压缩的zip资源 
            // 
            if (d_hot.s_out_res_zip_base64) {
                s_zip_res_body += `window.__zip = "${d_hot.s_out_res_zip_base64}";`;
                //导入库
                s_zip_res_body += this._get_zip_script();
            }
            //导入常规资源 
            s_zip_res_body += `window.__res=${JSON.stringify(d_hot.d_out_res_no_zip)};`;
        }
        const inject_channel_adapter = config_1.default.inject_channel_adapter;
        for (let key in inject_channel_adapter) {
            let d_channel = inject_channel_adapter[key];
            const s_channel_name = d_channel.s_name;
            const s_channel_config_name = d_channel.s_config_name || s_channel_name;
            if (!d_channel.b_enable) {
                continue;
            }
            // #### 通用脚本
            const s_common_body = this._get_common_script(s_channel_name);
            // 有配置是生成zip
            d_channel.b_out_zip = d_channel.b_out_zip || false;
            // html文件名
            d_channel.s_html_name = d_channel.s_html_name || "index.html";
            // 是否开启html压缩
            d_channel.b_html_compression = d_channel.b_html_compression || false;
            // zip文件名
            d_channel.s_zip_name = d_channel.s_zip_name || "index.zip";
            // #### 渠道脚本
            let s_channel_meta = this._get_channel_script(s_channel_config_name, "meta.html");
            if (s_channel_name == "unity") {
                // unity 需要设置商店地址，脚本被压缩或混淆了，需要提取出来给平台正则匹配
                if (config_1.default.d_hot.s_unity_inject_html) {
                    if (s_channel_meta) {
                        s_channel_meta = config_1.default.d_hot.s_unity_inject_html + "\n" + s_channel_meta;
                    }
                    else {
                        s_channel_meta = config_1.default.d_hot.s_unity_inject_html;
                    }
                }
            }
            const s_channel_head = this._get_channel_script(s_channel_config_name, "head.js");
            const s_channel_body = this._get_channel_script(s_channel_config_name, "script.js");
            let s_out_body = null;
            let l_body = [];
            if (d_channel.b_html_compression) {
                l_body = [s_channel_body, s_zip_res_body, s_common_body];
            }
            else {
                l_body = [s_channel_body, s_res_body, s_common_body];
            }
            s_out_body = l_body.join("\n");
            let s_html_content = this._add_meta_to_meta(d_hot.s_base_html_content, s_channel_meta);
            s_html_content = this._add_script_to_head(s_html_content, s_channel_head);
            s_html_content = this._add_script_to_body(s_html_content, s_out_body);
            let s_out_file_name = "";
            let out_data = null;
            // console.log(d_channel)
            if (d_channel.b_out_zip) {
                s_out_file_name = d_channel.s_zip_name;
                //生成zip的文件，使用不带压缩的
                s_out_body = s_html_content;
                var zip = new jszip.default();
                zip.file(d_channel.s_html_name, s_out_body, { compression: "DEFLATE" });
                // 生成更新后的zip文件
                out_data = await zip.generateAsync({
                    type: 'nodebuffer',
                    compression: "DEFLATE",
                });
            }
            else {
                s_out_file_name = d_channel.s_html_name;
                out_data = s_html_content;
            }
            let s_out_path = platform_1.default.join(s_out_dir, s_channel_name, s_out_file_name);
            platform_1.default.writeFileSync(s_out_path, out_data);
            utils_1.default.log(`[${s_channel_name}] [${utils_1.default.b_to_kb(out_data.length)}] \n${s_out_path}`);
        }
    }
    _add_meta_to_meta(s_html_content, s_content) {
        if (!s_content)
            return s_html_content;
        return s_html_content.replace("<style>", () => `${s_content}\n<style>`);
    }
    _add_script_to_head(s_html_content, s_content) {
        if (!s_content)
            return s_html_content;
        s_content = `<script type="text/javascript">\n${s_content}\n</script>`;
        return s_html_content.replace("</head>", () => `${s_content}\n</head>`);
    }
    _add_script_to_body(s_html_content, s_content) {
        if (!s_content)
            return s_html_content;
        s_content = `<script type="text/javascript">\n${s_content}\n</script>`;
        return s_html_content.replace("</body>", () => `${s_content}\n</body>`);
    }
    //获得压缩库脚本
    _get_zip_script() {
        return utils_1.default.get_json(config_1.default.constants.inject_jszip_script);
    }
    //获得通用脚本 
    _get_common_script(s_channel_name) {
        const s_base = `window.super_html_channel = "${s_channel_name}";`;
        // 通过打印到vconsole来看日志
        // const s_base = `window._abc_="";
        // function super_log(txt){console.log("[super-html] "+txt);window._abc_ += (txt+"\\n");
        // setTimeout(() =>{
        //     if(document.getElementsByClassName("vc-switch")[0]){
        //         document.getElementsByClassName("vc-switch")[0].innerHTML = window._abc_;
        //     };
        // },2000);
        // };
        // window.super_html_channel = "${s_channel_name}";super_log("channel: ${s_channel_name}");`
        const s_pre_load_script = `window.super_pre_load_script = ${JSON.stringify(config_1.default.d_hot.l_pre_load_script)};`;
        // #### 各个版本适配文件
        const s_version_adapter_body = utils_1.default.get_json(config_1.default.constants.inject_version_adapter[config_1.default.version]);
        const s_common = utils_1.default.get_json(config_1.default.constants.inject_common_script);
        return s_base + s_pre_load_script + s_version_adapter_body + s_common;
    }
    //获得渠道脚本 
    _get_channel_script(s_channel_name, s_file_name) {
        // 有配置脚本
        let s_script_path = `channel/${s_channel_name}/${s_file_name}`;
        const s_content = utils_1.default.get_json(s_script_path);
        return s_content || "";
    }
}
exports.default = new channel_handler();
