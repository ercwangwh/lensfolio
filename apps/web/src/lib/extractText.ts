export function extractText(html: string) {
  // 删除 img 标签和内容
  html = html.replace(/<img[^>]*>/gi, '');

  // 去除其他标签
  html = html.replace(/<\/?[a-z][^>]*>/gi, '');

  html = html.replace(/&nbsp;/g, '');

  html = html.trim();

  // 返回纯文本
  html = html.replace(/\n/g, '')?.substring(0, 1000);
  return html;
}
