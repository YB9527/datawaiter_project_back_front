import  index from '@/views/project/project.vue'
import  api from '@/views/project/api.vue'
import  database from '@/views/project/database.vue'
import  projectdic from '@/views/project/projectDic.vue'
import  projectlog from '@/views/project/projectLog.vue'
import  user from '@/views/project/user.vue'
import  resources from '@/views/project/resources.vue'
import  mapper from '@/views/project/mapper.vue'
import  flow from '@/views/project/flow.vue'

const project = {
  path: '/project',
  component: index,
  name: 'project',
  children:[
    {
      path: 'api',
      component: api,
      name: 'api',
    },
    {
      path: 'database',
      component: database,
      name: 'database',
    },
    {
      path: 'projectdic',
      component: projectdic,
      name: 'projectdic',
    },
    {
      path: 'projectlog',
      component: projectlog,
      name: 'projectlog',
    },
    {
      path: 'user',
      component: user,
      name: 'user',
    },
    {
      path: 'resources',
      component: resources,
      name: 'resources',
    },
    {
      path: 'mapper',
      component: mapper,
      name: 'mapper',
    },
    {
      path: 'flow',
      component: flow,
      name: 'flow',
    }
  ]
};

export default project
