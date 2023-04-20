import request from './axios';
import { ICmd } from '../model/interData';
// import { tool } from '@/utils/common/tool';
import { get, add, update, del } from './funApi';
class cmdApi {
  /**
   * 查询数量
   * @returns 总数
   */
  static GetSum() {
    const url = `/api/cmd/sum`;
    return get(url, false);
  }

  /**
   * 模糊查询
   * @param identity 所有:0|分类:1|标签:2|用户:3|标签+用户:4
   * @param type 查询条件
   * @param name 查询字段
   * @param cache 缓存
   */
  // static async GetContains(identity = 0, type = 'null', name = '', cache = true) {
  //   const data = await request(
  //     `/article/contains?identity=${identity}&type=${type}&name=${name}&cache=${cache}`,
  //     false
  //   );
  //   tool.MomentTimeList(data);
  //   return data;
  // }

  /**
   * @description: 主键查询
   * @param {number} id
   * @param {boolean} cache
   */
  // static GetById(id: number, cache = false) {
  //   return get(`/article/byid?id=${id}&cache=${cache}`, false);
  // }
  /**
   * 条件查询 GetTypeAsync
   * @param identity 分类:1 || 标签:2
   * @param type 查询条件
   * @param cache 缓存
   * @returns
   */
  // static GetType(identity: number, type = 'null', cache = true) {
  //   return get(`/article/type?identity=${identity}&type=${type}&cache=${cache}`, false);
  // }

  /**
   * 内容统计
   * @param identity 所有:0|分类:1|标签:2|用户:3
   * @param type 内容:1|阅读:2|点赞:3
   * @param name 查询参数
   * @param cache 缓存
   */
  // static GetStrSum(identity: number, type: number, name = 'null', cache = true): Promise<any> {
  //   return get(`/article/strSum??identity=${identity}&type=${type}&name=${name}&cache=${cache}`, false);
  // }

  /**
   * @description: 分页查询
   * @param {number} identity 所有:0|分类:1|标签:2|用户:3|标签+用户:4
   * @param {number} pagesize 当前页码
   * @param {number} pageIndex 每页记录条数
   */
  static async GetPaging(identity: number = 0, pageIndex: number = 1, pagesize: number = 6) {
    const data = await get(`/api/cmd/paging/${identity}/${pageIndex}/${pagesize}`, false);
    ///api/cmd/paging/0/1/10
    return data;
  }

  /**
   * @description: 条件更新
   * @param {any} entity
   * @param {string} type
   */
  static UpdatePortion(entity: any, type: string): Promise<any> {
    return update(`/article/upPortion?type=${type}`, entity);
  }

  /**
   * @description: 新增数据
   * @param {ICmd} entity
   */
  static Add(entity: ICmd) {
    return add('/article/add', entity);
  }

  /**
   * @description: 更新数据
   * @param {ICmd} entity
   */
  static Update(entity: ICmd) {
    return update(`/article/edit`, entity);
  }

  /**
   * @description: 删除
   * @param {number} id
   */
  static Del(id: number) {
    return del(`/article/del?id=${id}`, false);
  }
}

export { cmdApi };
