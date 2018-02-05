//引入路由模块，每个路由文件都要引入这个模块
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/shared/auth-guard.service';

/*routes数组，描述如何进行导航
 * 数组中每个元素：
 * path:       路由匹配的路径，当匹配成功后，就会加载这个路径对应的组件
 *             其中：('**')路径是一个通配符，当所请求的URL不匹配其他定义的路由表中的任何路径时，路由器就会选择此路由。
 * redirectTo: 重定向路径，路由会把这个字段的值替换`path`字段的值并从新匹配路径。
 *
 * */

export const routes: Routes = [
  { path: '**', redirectTo: 'dashboard' }
];

/*RouterModule.forRoot: 配置路由器，并把这个值添加到AppModule模块中imports数组中，使路由生效。
 * routes：            配置的路由规则
 * { useHash: true }： 基于HashLocationStrategy的传统方式路由，加了这个后会在链接中加入 `/#`
 * */
export const routing = RouterModule.forRoot(routes, { useHash: true });
