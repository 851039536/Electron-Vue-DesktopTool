import { get } from './funApi';
class UpDownApi {
  /**
   * @description: 主键查询
   * @param {number} id
   */
  static GetById(id: number) {
    const data = get(`/api/up-down/by-id/${id}`, false);
    return data;
  }

  /**
   * @description: 分页查询
   * @param {number} pagesize 当前页码
   * @param {number} pageIndex 每页记录条数
   */
  static async GetPaging(pageIndex: number = 1, pagesize: number = 6) {
    const data = await get(`/api/up-down/paging/${pageIndex}/${pagesize}`, false);
    return data;
  }
}

export { UpDownApi };
