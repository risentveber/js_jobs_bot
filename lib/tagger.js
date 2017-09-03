const Az = require('az');

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

const namesMap = {
    'ror': 'Ruby_on_Rails',
    'js': 'JS',
    'javascript': 'JS',
    'sql': 'SQL',
    'ангуляр': 'Angular',
    'angular': 'Angular',
    'angular2': 'Angular_2',
    'angular3': 'Angular_3',
    'angular4': 'Angular_4',
    'angularjs': 'Angular',
    'react': 'React',
    'reactjs': 'React',
    'реакт': 'React',
    'node': 'NodeJS',
    'nodejs': 'NodeJS',
    'linux': 'Linux',
    'ubuntu': 'Ubuntu',
    'unix': 'UNIX',
    'windows': 'Windows',
    'backbone': 'Backbone',
    'ember': 'Ember',
    'vuejs': 'VueJS',
    'php': 'PHP',
    'junior': 'Junior',
    'middle': 'Middle',
    'senior': 'Senior',
    'teamlead': 'Teamlead',
    'git': 'Git',
    'svn': 'SVN',
    'gulp': 'Gulp',
    'bootstrap': 'Bootstrap',
    'html': 'HTML',
    'css': 'CSS',
    'jquery': 'JQuery',
    'mongo': 'MongoDB',
    'mongodb': 'MongoDB',
    'nosql': 'NoSQL',
    'backend': 'Backend',
    'бэкенд': 'Backend',
    'frontend': 'Frontend',
    'front': 'Frontend',
    'фронтенд': 'Frontend',
    'фронтэнд': 'Frontend',
    'laravel': 'Laravel',
    'lamp': 'LAMP',
    'mean': 'MEAN',
    'pgsql': 'PostgreSQL',
    'postgresql': 'PostgreSQL',
    'fullstack': 'Fullstack',
    'stack': 'Fullstack',
    'фуллстек': 'Fullstack',
    'фуллстэк': 'Fullstack',
    'api': 'API',
    'http': 'HTTP',
    'ajax': 'AJAX',
    'websocket': 'WebSocket',
    'phantom': 'PhantomJS',
    'phantomjs': 'PhantomJS',
    'selenium': 'Selenium',
    'agile': 'Agile',
    'scrum': 'SCRUM',
    'photoshop': 'Photoshop',
    'tdd': 'TDD',
    'powerpoint': 'Powerpoint',
    'bdd': 'BDD',
    'python': 'Python',
    'lead': 'Teamlead',
    'zend': 'Zend',
    'yii': 'Yii',
    'symfony': 'Symfony',
    'review': 'CodeReview',
    'code_review': 'CodeReview',
    'ci': 'CI',
    'ruby': 'Ruby',
    'erlang': 'Erlang',
    'kohana': 'Kohana',
    'django': 'Django',
    'grunt': 'Grunt',
    'sass': 'Sass',
    'scss': 'Sass',
    'less': 'Less',
    'mysql': 'MySQL',
    'npm': 'npm',
    'babel': 'Babel',
    'webpack': 'Webpack',
    'redis': 'Redis',
    'java': 'Java',
    'rest': 'REST',
    'soap': 'SOAP',
    'nginx': 'Nginx',
    'apache': 'Apache',
    'docker': 'Docker',
    'express': 'ExpressJS',
    'meteor': 'MeteorJS',
    'typescript': 'Typescript',
    'coffescript': 'Coffescript'
};

function getTags(pureContent) {
    const tokens = Az.Tokens(pureContent).done();
    const tags = tokens.filter(t => t.type.toString() === 'WORD')
        .map(t => t.toString().toLowerCase().replace('-', '_'))
        .map(name => namesMap[name])
        .filter(t => t)
        .filter(onlyUnique);
    return tags;
}

module.exports = {
    getTags
};