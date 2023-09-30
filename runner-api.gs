const sheet_name = 'X(Twitter) Client 走者情報'; // タブの名前
const runner_N = 10; // 最大走者人数
const commentary_N = 10; // 最大解説人数
const id_idx = 0;
const gamename_idx = 1;
const category_idx = 2;
const runner_idx = 3;
const commentary_idx = runner_idx + runner_N * 2;

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name);
  // 1行目(ヘッダ)とゲーム名のない行を削除
  const values = sheet.getDataRange().getValues().slice(1)
    .filter(row => row[gamename_idx] != '');

  const data = values.map(row => {
    const f = ((first_idx, N) => {
      let rr = [];
    
      for (var i = 0; i < N; ++i) {
        if (row[first_idx + i * 2].trim() == '') {
          break;
        }

        rr.push({
          username: row[first_idx + i * 2].trim(),
          twitterid: row[first_idx + i * 2 + 1].trim().replace(/^[@＠]/,''),
        });
      }
      return rr;
    });

    const r = {
      id: row[id_idx],
      gamename: row[gamename_idx],
      category: row[category_idx],
      gameAndCategory: `${row[gamename_idx]} - ${row[category_idx]}`,
      runner: f(runner_idx, runner_N),
      commentary: f(commentary_idx, commentary_N),
    };

    return r;
  });
  const api = {
    status: 'ok',
    data: data,
  };

  // JSONとして出力
  const json = JSON.stringify(api, null, 2);
  console.log(json);

  const output = ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
  return output;
}
