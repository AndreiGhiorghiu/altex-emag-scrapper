var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __assign = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// server/http.ts
var import_fastify = __toModule(require("fastify"));
var import_qs = __toModule(require("qs"));
var import_path = __toModule(require("path"));
var import_fastify_static = __toModule(require("fastify-static"));
var fastify = (0, import_fastify.default)({
  querystringParser: import_qs.default.parse,
  caseSensitive: false,
  ignoreTrailingSlash: true,
  maxParamLength: 64,
  bodyLimit: 1048576,
  connectionTimeout: 48 * 1e3,
  keepAliveTimeout: 8 * 1e3,
  pluginTimeout: 8 * 1e3,
  onProtoPoisoning: "remove",
  onConstructorPoisoning: "remove"
});
fastify.register(import_fastify_static.default, {
  root: import_path.default.join(__dirname, ""),
  prefix: "/"
});
var http_default = fastify;

// server/services/emag.ts
var import_puppeteer = __toModule(require("puppeteer"));
var import_cheerio = __toModule(require("cheerio"));
var url = "https://www.emag.ro/search/telefoane-mobile/";
async function getProducts(search) {
  const data = [];
  const browser = await import_puppeteer.default.launch();
  const page = await browser.newPage();
  await page.goto(`${url}${search}`);
  const html = await page.content();
  browser.close();
  const products = (0, import_cheerio.default)(".js-product-data", html);
  products.each(function() {
    const title = (0, import_cheerio.default)("h2.product-title-zone", (0, import_cheerio.default)(this).html()).text().trim();
    const priceOld = (0, import_cheerio.default)(".product-old-price", (0, import_cheerio.default)(this).html()).text().trim();
    const priceNew = (0, import_cheerio.default)(".product-new-price", (0, import_cheerio.default)(this).html()).text().trim();
    const thumb = (0, import_cheerio.default)(".thumbnail img", (0, import_cheerio.default)(this).html()).attr("src")?.trim?.();
    data.push({
      title,
      price: {
        old: priceOld,
        new: priceNew
      },
      image: thumb
    });
  });
  return {emag: data};
}
var emag_default = getProducts;

// server/services/altex.ts
var import_puppeteer2 = __toModule(require("puppeteer"));
var import_cheerio2 = __toModule(require("cheerio"));
var import_qs2 = __toModule(require("qs"));
var import_fs = __toModule(require("fs"));
var import_axios = __toModule(require("axios"));
async function test(search) {
  const {data} = await (0, import_axios.default)({
    method: "GET",
    url: `https://fenrir.altex.ro/catalog/search/${search.replaceAll(" ", "%20")}`,
    params: {
      filter: "cat:283-telefoane"
    },
    headers: {
      "Accept-Encoding": "gzip"
    }
  });
  return {
    altex: data.products.map((item) => ({
      title: item.name,
      price: {
        old: item.regular_price,
        new: item.price
      },
      image: item.thumbnail
    }))
  };
}
var altex_default = test;

// server/api.ts
var import_path2 = __toModule(require("path"));
http_default.route({
  method: "GET",
  url: "/api/get-products",
  schema: {
    querystring: {
      type: "object",
      properties: {
        search: {type: "string"}
      },
      required: ["search"]
    }
  },
  async handler({query}, res) {
    const {search} = query;
    const data = await Promise.all([emag_default(search), altex_default(search)]);
    res.send(__assign(__assign({}, data[0]), data[1]));
  }
});
http_default.get("/", (req, reply) => {
  return reply.sendFile("index.html", import_path2.default.join(__dirname, ""));
});

// server/index.ts
http_default.listen(3e3, function(err, address) {
  if (err) {
    http_default.log.error(err);
    process.exit(1);
  }
  http_default.log.info(`server listening on ${address}`);
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc2VydmVyL2h0dHAudHMiLCAiLi4vc2VydmVyL3NlcnZpY2VzL2VtYWcudHMiLCAiLi4vc2VydmVyL3NlcnZpY2VzL2FsdGV4LnRzIiwgIi4uL3NlcnZlci9hcGkudHMiLCAiLi4vc2VydmVyL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgRmFzdGlmeSBmcm9tICdmYXN0aWZ5JztcbmltcG9ydCBxcyBmcm9tICdxcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBGc3RhdGljIGZyb20gJ2Zhc3RpZnktc3RhdGljJztcblxuY29uc3QgZmFzdGlmeSA9IEZhc3RpZnkoe1xuXHRxdWVyeXN0cmluZ1BhcnNlcjogcXMucGFyc2UsXG5cdGNhc2VTZW5zaXRpdmU6IGZhbHNlLFxuXHRpZ25vcmVUcmFpbGluZ1NsYXNoOiB0cnVlLFxuXHRtYXhQYXJhbUxlbmd0aDogNjQsXG5cdGJvZHlMaW1pdDogMTA0ODU3Nixcblx0Y29ubmVjdGlvblRpbWVvdXQ6IDQ4ICogMTAwMCxcblx0a2VlcEFsaXZlVGltZW91dDogOCAqIDEwMDAsXG5cdHBsdWdpblRpbWVvdXQ6IDggKiAxMDAwLFxuXHRvblByb3RvUG9pc29uaW5nOiAncmVtb3ZlJyxcblx0b25Db25zdHJ1Y3RvclBvaXNvbmluZzogJ3JlbW92ZScsXG59KTtcblxuZmFzdGlmeS5yZWdpc3RlcihGc3RhdGljLCB7XG5cdHJvb3Q6IHBhdGguam9pbihfX2Rpcm5hbWUsICcnKSxcblx0cHJlZml4OiAnLycsXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZmFzdGlmeTtcbiIsICJpbXBvcnQgcHVwcGV0ZWVyIGZyb20gJ3B1cHBldGVlcic7XG5pbXBvcnQgJCBmcm9tICdjaGVlcmlvJztcblxuY29uc3QgdXJsID0gJ2h0dHBzOi8vd3d3LmVtYWcucm8vc2VhcmNoL3RlbGVmb2FuZS1tb2JpbGUvJztcblxuYXN5bmMgZnVuY3Rpb24gZ2V0UHJvZHVjdHMoc2VhcmNoOiBzdHJpbmcpIHtcblx0Y29uc3QgZGF0YTogU2NyYXBwZXJEYXRhW10gPSBbXTtcblx0Y29uc3QgYnJvd3NlciA9IGF3YWl0IHB1cHBldGVlci5sYXVuY2goKTtcblx0Y29uc3QgcGFnZSA9IGF3YWl0IGJyb3dzZXIubmV3UGFnZSgpO1xuXG5cdGF3YWl0IHBhZ2UuZ290byhgJHt1cmx9JHtzZWFyY2h9YCk7XG5cdGNvbnN0IGh0bWwgPSBhd2FpdCBwYWdlLmNvbnRlbnQoKTtcblxuXHRicm93c2VyLmNsb3NlKCk7XG5cblx0Y29uc3QgcHJvZHVjdHMgPSAkKCcuanMtcHJvZHVjdC1kYXRhJywgaHRtbCk7XG5cblx0cHJvZHVjdHMuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc3QgdGl0bGUgPSAkKCdoMi5wcm9kdWN0LXRpdGxlLXpvbmUnLCAkKHRoaXMpLmh0bWwoKSkudGV4dCgpLnRyaW0oKTtcblx0XHRjb25zdCBwcmljZU9sZCA9ICQoJy5wcm9kdWN0LW9sZC1wcmljZScsICQodGhpcykuaHRtbCgpKS50ZXh0KCkudHJpbSgpO1xuXHRcdGNvbnN0IHByaWNlTmV3ID0gJCgnLnByb2R1Y3QtbmV3LXByaWNlJywgJCh0aGlzKS5odG1sKCkpLnRleHQoKS50cmltKCk7XG5cdFx0Y29uc3QgdGh1bWIgPSAkKCcudGh1bWJuYWlsIGltZycsICQodGhpcykuaHRtbCgpKS5hdHRyKCdzcmMnKT8udHJpbT8uKCk7XG5cblx0XHRkYXRhLnB1c2goe1xuXHRcdFx0dGl0bGUsXG5cdFx0XHRwcmljZToge1xuXHRcdFx0XHRvbGQ6IHByaWNlT2xkLFxuXHRcdFx0XHRuZXc6IHByaWNlTmV3LFxuXHRcdFx0fSxcblx0XHRcdGltYWdlOiB0aHVtYixcblx0XHR9KTtcblx0fSk7XG5cblx0cmV0dXJuIHsgZW1hZzogZGF0YSB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRQcm9kdWN0cztcblxuaW50ZXJmYWNlIFNjcmFwcGVyRGF0YSB7XG5cdHRpdGxlOiBzdHJpbmc7XG5cdHByaWNlOiB7XG5cdFx0b2xkOiBzdHJpbmc7XG5cdFx0bmV3OiBzdHJpbmc7XG5cdH07XG5cdGltYWdlOiAnc3RyaW5nJztcbn1cbiIsICJpbXBvcnQgcHVwcGV0ZWVyIGZyb20gJ3B1cHBldGVlcic7XG5pbXBvcnQgJCBmcm9tICdjaGVlcmlvJztcbmltcG9ydCBxcyBmcm9tICdxcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcblxuY29uc3QgdXJsID0gJ2h0dHBzOi8vYWx0ZXgucm8vY2F1dGEvZmlsdHJ1L2NhdC8yODMtdGVsZWZvYW5lLz8nO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRQcm9kdWN0cyhzZWFyY2g6IHN0cmluZykge1xuXHRjb25zdCBkYXRhOiBTY3JhcHBlckRhdGFbXSA9IFtdO1xuXHRjb25zdCBicm93c2VyID0gYXdhaXQgcHVwcGV0ZWVyLmxhdW5jaCh7XG5cdFx0aGVhZGxlc3M6IGZhbHNlLFxuXHR9KTtcblx0Y29uc3QgcGFnZSA9IGF3YWl0IGJyb3dzZXIubmV3UGFnZSgpO1xuXG5cdGF3YWl0IHBhZ2Uuc2V0RXh0cmFIVFRQSGVhZGVycyh7XG5cdFx0J0FjY2VwdC1FbmNvZGluZyc6ICdnemlwJyxcblx0XHQnVXNlci1BZ2VudCc6XG5cdFx0XHQnTW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTVfNykgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzkxLjAuNDQ3Mi4xMTQgU2FmYXJpLzUzNy4zNicsXG5cdH0pO1xuXG5cdGNvbnN0IHVybDIgPSBgJHt1cmx9JHtxcy5zdHJpbmdpZnkoeyBxOiBzZWFyY2ggfSl9YDtcblxuXHRhd2FpdCBwYWdlLmdvdG8odXJsMiwgeyB3YWl0VW50aWw6ICdsb2FkJywgdGltZW91dDogMCB9KTtcblxuXHQvLyBhd2FpdCBwYWdlLndhaXRGb3JTZWxlY3RvcignLlByb2R1Y3RzJyk7XG5cblx0Y29uc3QgaHRtbCA9IGF3YWl0IHBhZ2UuY29udGVudCgpO1xuXG5cdGJyb3dzZXIuY2xvc2UoKTtcblxuXHRmcy53cml0ZUZpbGVTeW5jKCcuL3Rlc3QuaHRtbCcsIGh0bWwpO1xuXG5cdGNvbnN0IHByb2R1Y3RzID0gJCgnLlByb2R1Y3RzLWl0ZW0nLCBodG1sKTtcblxuXHRwcm9kdWN0cy5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRjb25zdCB0aXRsZSA9ICQoJy5Qcm9kdWN0LW5hbWUnLCAkKHRoaXMpLmh0bWwoKSkudGV4dCgpLnRyaW0oKTtcblx0XHRjb25zdCBwcmljZU9sZCA9ICQoJy5QcmljZS1vbGQnLCAkKHRoaXMpLmh0bWwoKSkudGV4dCgpLnRyaW0oKTtcblx0XHRjb25zdCBwcmljZU5ldyA9ICQoJy5QcmljZS1jdXJyZW50JywgJCh0aGlzKS5odG1sKCkpLnRleHQoKS50cmltKCk7XG5cblx0XHRkYXRhLnB1c2goe1xuXHRcdFx0dGl0bGUsXG5cdFx0XHRwcmljZToge1xuXHRcdFx0XHRvbGQ6IHByaWNlT2xkLFxuXHRcdFx0XHRuZXc6IHByaWNlTmV3LFxuXHRcdFx0fSxcblx0XHR9KTtcblx0fSk7XG5cblx0cmV0dXJuIHsgYWx0ZXg6IGRhdGEgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdChzZWFyY2g6IHN0cmluZykge1xuXHRjb25zdCB7IGRhdGEgfSA9IGF3YWl0IGF4aW9zKHtcblx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdHVybDogYGh0dHBzOi8vZmVucmlyLmFsdGV4LnJvL2NhdGFsb2cvc2VhcmNoLyR7c2VhcmNoLnJlcGxhY2VBbGwoJyAnLCAnJTIwJyl9YCxcblx0XHRwYXJhbXM6IHtcblx0XHRcdGZpbHRlcjogJ2NhdDoyODMtdGVsZWZvYW5lJyxcblx0XHR9LFxuXHRcdGhlYWRlcnM6IHtcblx0XHRcdCdBY2NlcHQtRW5jb2RpbmcnOiAnZ3ppcCcsXG5cdFx0fSxcblx0fSk7XG5cblx0cmV0dXJuIHtcblx0XHRhbHRleDogZGF0YS5wcm9kdWN0cy5tYXAoKGl0ZW0pID0+ICh7XG5cdFx0XHR0aXRsZTogaXRlbS5uYW1lLFxuXHRcdFx0cHJpY2U6IHtcblx0XHRcdFx0b2xkOiBpdGVtLnJlZ3VsYXJfcHJpY2UsXG5cdFx0XHRcdG5ldzogaXRlbS5wcmljZSxcblx0XHRcdH0sXG5cdFx0XHRpbWFnZTogaXRlbS50aHVtYm5haWwsXG5cdFx0fSkpLFxuXHR9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB0ZXN0O1xuXG5pbnRlcmZhY2UgU2NyYXBwZXJEYXRhIHtcblx0dGl0bGU6IHN0cmluZztcblx0cHJpY2U6IHtcblx0XHRvbGQ6IHN0cmluZztcblx0XHRuZXc6IHN0cmluZztcblx0fTtcbn1cbiIsICJpbXBvcnQgaHR0cCBmcm9tICcuL2h0dHAnO1xuaW1wb3J0IGdldEVtYWdQcm9kdWN0cyBmcm9tICcuL3NlcnZpY2VzL2VtYWcnO1xuaW1wb3J0IGdldEFsdGV4UHJvZHVjdHMgZnJvbSAnLi9zZXJ2aWNlcy9hbHRleCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaHR0cC5yb3V0ZTx7IFF1ZXJ5c3RyaW5nOiB7IHNlYXJjaDogc3RyaW5nIH0gfT4oe1xuXHRtZXRob2Q6ICdHRVQnLFxuXHR1cmw6ICcvYXBpL2dldC1wcm9kdWN0cycsXG5cdHNjaGVtYToge1xuXHRcdHF1ZXJ5c3RyaW5nOiB7XG5cdFx0XHR0eXBlOiAnb2JqZWN0Jyxcblx0XHRcdHByb3BlcnRpZXM6IHtcblx0XHRcdFx0c2VhcmNoOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG5cdFx0XHR9LFxuXHRcdFx0cmVxdWlyZWQ6IFsnc2VhcmNoJ10sXG5cdFx0fSxcblx0fSxcblx0YXN5bmMgaGFuZGxlcih7IHF1ZXJ5IH0sIHJlcykge1xuXHRcdGNvbnN0IHsgc2VhcmNoIH0gPSBxdWVyeTtcblxuXHRcdGNvbnN0IGRhdGEgPSBhd2FpdCBQcm9taXNlLmFsbChbZ2V0RW1hZ1Byb2R1Y3RzKHNlYXJjaCksIGdldEFsdGV4UHJvZHVjdHMoc2VhcmNoKV0pO1xuXG5cdFx0cmVzLnNlbmQoeyAuLi5kYXRhWzBdLCAuLi5kYXRhWzFdIH0pO1xuXHR9LFxufSk7XG5cbmh0dHAuZ2V0KCcvJywgKHJlcSwgcmVwbHkpID0+IHtcblx0cmV0dXJuIHJlcGx5LnNlbmRGaWxlKCdpbmRleC5odG1sJywgcGF0aC5qb2luKF9fZGlybmFtZSwgJycpKTtcbn0pO1xuIiwgImltcG9ydCBodHRwIGZyb20gJy4vaHR0cCc7XG5cbmltcG9ydCAnLi9hcGknO1xuXG5odHRwLmxpc3RlbigzMDAwLCBmdW5jdGlvbiAoZXJyLCBhZGRyZXNzKSB7XG5cdGlmIChlcnIpIHtcblx0XHRodHRwLmxvZy5lcnJvcihlcnIpO1xuXHRcdHByb2Nlc3MuZXhpdCgxKTtcblx0fVxuXHRodHRwLmxvZy5pbmZvKGBzZXJ2ZXIgbGlzdGVuaW5nIG9uICR7YWRkcmVzc31gKTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFCQUFvQjtBQUNwQixnQkFBZTtBQUNmLGtCQUFpQjtBQUNqQiw0QkFBb0I7QUFFcEIsSUFBTSxVQUFVLDRCQUFRO0FBQUEsRUFDdkIsbUJBQW1CLGtCQUFHO0FBQUEsRUFDdEIsZUFBZTtBQUFBLEVBQ2YscUJBQXFCO0FBQUEsRUFDckIsZ0JBQWdCO0FBQUEsRUFDaEIsV0FBVztBQUFBLEVBQ1gsbUJBQW1CLEtBQUs7QUFBQSxFQUN4QixrQkFBa0IsSUFBSTtBQUFBLEVBQ3RCLGVBQWUsSUFBSTtBQUFBLEVBQ25CLGtCQUFrQjtBQUFBLEVBQ2xCLHdCQUF3QjtBQUFBO0FBR3pCLFFBQVEsU0FBUywrQkFBUztBQUFBLEVBQ3pCLE1BQU0sb0JBQUssS0FBSyxXQUFXO0FBQUEsRUFDM0IsUUFBUTtBQUFBO0FBR1QsSUFBTyxlQUFROzs7QUN2QmYsdUJBQXNCO0FBQ3RCLHFCQUFjO0FBRWQsSUFBTSxNQUFNO0FBRVosMkJBQTJCLFFBQWdCO0FBQzFDLFFBQU0sT0FBdUI7QUFDN0IsUUFBTSxVQUFVLE1BQU0seUJBQVU7QUFDaEMsUUFBTSxPQUFPLE1BQU0sUUFBUTtBQUUzQixRQUFNLEtBQUssS0FBSyxHQUFHLE1BQU07QUFDekIsUUFBTSxPQUFPLE1BQU0sS0FBSztBQUV4QixVQUFRO0FBRVIsUUFBTSxXQUFXLDRCQUFFLG9CQUFvQjtBQUV2QyxXQUFTLEtBQUssV0FBWTtBQUN6QixVQUFNLFFBQVEsNEJBQUUseUJBQXlCLDRCQUFFLE1BQU0sUUFBUSxPQUFPO0FBQ2hFLFVBQU0sV0FBVyw0QkFBRSxzQkFBc0IsNEJBQUUsTUFBTSxRQUFRLE9BQU87QUFDaEUsVUFBTSxXQUFXLDRCQUFFLHNCQUFzQiw0QkFBRSxNQUFNLFFBQVEsT0FBTztBQUNoRSxVQUFNLFFBQVEsNEJBQUUsa0JBQWtCLDRCQUFFLE1BQU0sUUFBUSxLQUFLLFFBQVE7QUFFL0QsU0FBSyxLQUFLO0FBQUEsTUFDVDtBQUFBLE1BQ0EsT0FBTztBQUFBLFFBQ04sS0FBSztBQUFBLFFBQ0wsS0FBSztBQUFBO0FBQUEsTUFFTixPQUFPO0FBQUE7QUFBQTtBQUlULFNBQU8sQ0FBRSxNQUFNO0FBQUE7QUFHaEIsSUFBTyxlQUFROzs7QUNwQ2Ysd0JBQXNCO0FBQ3RCLHNCQUFjO0FBQ2QsaUJBQWU7QUFDZixnQkFBZTtBQUNmLG1CQUFrQjtBQWdEbEIsb0JBQW9CLFFBQWdCO0FBQ25DLFFBQU0sQ0FBRSxRQUFTLE1BQU0sMEJBQU07QUFBQSxJQUM1QixRQUFRO0FBQUEsSUFDUixLQUFLLDBDQUEwQyxPQUFPLFdBQVcsS0FBSztBQUFBLElBQ3RFLFFBQVE7QUFBQSxNQUNQLFFBQVE7QUFBQTtBQUFBLElBRVQsU0FBUztBQUFBLE1BQ1IsbUJBQW1CO0FBQUE7QUFBQTtBQUlyQixTQUFPO0FBQUEsSUFDTixPQUFPLEtBQUssU0FBUyxJQUFJLENBQUMsU0FBVTtBQUFBLE1BQ25DLE9BQU8sS0FBSztBQUFBLE1BQ1osT0FBTztBQUFBLFFBQ04sS0FBSyxLQUFLO0FBQUEsUUFDVixLQUFLLEtBQUs7QUFBQTtBQUFBLE1BRVgsT0FBTyxLQUFLO0FBQUE7QUFBQTtBQUFBO0FBS2YsSUFBTyxnQkFBUTs7O0FDekVmLG1CQUFpQjtBQUVqQixhQUFLLE1BQTJDO0FBQUEsRUFDL0MsUUFBUTtBQUFBLEVBQ1IsS0FBSztBQUFBLEVBQ0wsUUFBUTtBQUFBLElBQ1AsYUFBYTtBQUFBLE1BQ1osTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLFFBQ1gsUUFBUSxDQUFFLE1BQU07QUFBQTtBQUFBLE1BRWpCLFVBQVUsQ0FBQztBQUFBO0FBQUE7QUFBQSxRQUdQLFFBQVEsQ0FBRSxRQUFTLEtBQUs7QUFDN0IsVUFBTSxDQUFFLFVBQVc7QUFFbkIsVUFBTSxPQUFPLE1BQU0sUUFBUSxJQUFJLENBQUMsYUFBZ0IsU0FBUyxjQUFpQjtBQUUxRSxRQUFJLEtBQUssc0JBQUssS0FBSyxLQUFPLEtBQUs7QUFBQTtBQUFBO0FBSWpDLGFBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxVQUFVO0FBQzdCLFNBQU8sTUFBTSxTQUFTLGNBQWMscUJBQUssS0FBSyxXQUFXO0FBQUE7OztBQ3ZCMUQsYUFBSyxPQUFPLEtBQU0sU0FBVSxLQUFLLFNBQVM7QUFDekMsTUFBSSxLQUFLO0FBQ1IsaUJBQUssSUFBSSxNQUFNO0FBQ2YsWUFBUSxLQUFLO0FBQUE7QUFFZCxlQUFLLElBQUksS0FBSyx1QkFBdUI7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
