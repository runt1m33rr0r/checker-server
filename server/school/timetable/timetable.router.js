function init({
    app,
    controllers,
}) {
    const settingsRoute = '/school/settings/';
    const controller = controllers.timetable;

    app.get('/api/groups', controller.getAllGroups);
    app.get('/api/subjects', controller.getAllSubjects);

    app.get(settingsRoute + 'base', controller.getBaseSettingsPage);
    app.get(settingsRoute + 'subjects', controller.getSubjectSettingsPage);
    app.get(settingsRoute + 'groups', controller.getGroupsSettingsPage);
    app.get(settingsRoute + 'timetable', controller.getTimetableSettingsPage);

    app.post(settingsRoute + 'base', controller.saveBaseSettings);
    app.post(settingsRoute + 'subjects', controller.saveSubjectSettings);
    app.post(settingsRoute + 'groups', controller.saveGroupsSettings);
    app.post(settingsRoute + 'timetable', controller.saveTimetableSettings);
}

module.exports = {
    init,
};