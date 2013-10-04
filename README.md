# Data Vu

Mac OS X Dashboard Widget allowing simple and effective synchronization of files.

This project is not actively maintained anymore. For that reason, I've made it open source.


## Summary

The Data Vu widget is the simplest way to create a backup of your files. It allows you to quickly synchronize your data from any folder to any location: an external drive, a different partition, another folder on the same drive, even across the network to a remote server!

To define the source and target directories, drop folders onto the widget:

1. Start dragging a folder in the Finder,
2. While still dragging your folder, activate Dashboard via its hot-key†
3. Drop the folder onto the appropriate area.

†The Default hot-key for Dashboard is either the `F4` or `F12` button (depending on your model of Mac). Different hot-keys/hot-corners can be defined your System Preferences.

![The front of the Data Vu Widget](http://demoive.github.io/Data-Vu/data-vu-front.png)


## Features

- Extremely fast mirroring operation by updating only the differences between two sets of files using an efficient checksum-search algorithm
- Preview mode allows you to see what “will be transferred”
- View a summary of the activity automatically or save a detailed log of everything that was copied for your records
- Automatically check for updates


## FAQ

### Why doesn’t the target include my source folder after a sync?

Many people are accustomed to creating a copy of a folder by the “copy & paste” operation. However, it is important to note that the Data Vu widget does **not** simply copy the _source directory_ to the _target directory_; it is much more sophisticated than that. By defining a _source_ directory, the Data Vu widget will synchronize **the contents** of that directory with **the contents** of your target directory. It is important to realize the distinction between _copying a folder_ and _synchronizing its contents_.

If you're still confused, use the following reasoning and you’ll never forget: If you want to create a bootable clone of your Hard Drive (let’s say it is called “My HD”), you’d set the source in your Data Vu widget to “My HD” and the target to the root of you’re removable Hard Drive (we’ll call it “Backup HD”). After the synchronization is complete and you open your external drive, you wouldn’t expect to see a folder called “My HD” but rather exactly what you’d see if you opened your Hard Drive.

### Does the Data Vu widget handle OS X’s resource forks?

Totally! The Data Vu widget uses the `rsync` command which as of v3.0 handles OS X’s resource forks wonderfully.

### If I have Time Machine, Apple’s automatic back up utility, I have no use for this tool, right?

Wrong! Although Time Machine allows you to exclude certain folders from the backup (so that you can control what is backed up), it keeps copies of things you’ve deleted (to enable restoration of different versions). Although this feature can be useful, your backup will also be loaded with data that you don’t need—or worse, that you don’t want anybody to ever see. The Data Vu widget creates an exact mirror of your source so that your target contains no less & more importantly, no more data than you expect.

### What is the _Mirror_ operation?

To create a _Mirror_ of a folder is to create an exact duplicate of it. Therefore, with this preference turned on, the Data Vu widget will delete and/or replace any file necessary in the target so that it becomes an exact replica of the source. Be sure there is nothing in the target that you'll miss!

### What happens if I turn off the Mirror operation?

When the Mirror option is disabled, nothing will be deleted in the target directory. In other words, only files that do not exist at all in the target are copied from the source. The only exception is when a file from the source needs to replace a file in the target. In this case, the file in the target will of course need to be removed before the new one takes its place.

In either case, files that happen to be newer in the target will **never** be replaced.

### Why is the number of _total files_ in the results summary larger than the number of _files transferred_?

The number of _total files_ displayed in the results summary includes directories and the number of _files transferred_ does not include directories.


## Release notes

- **Version 1.4b** — _March 31, 2009 (public beta)_
  - Added pre-sync validations that ensure permissions are valid
  - Improved how empty source folders are determined
  - Determined more causes for error codes
  - Resolved problem where the last sync timestamp was erased during a load

- **Version 1.3** — _February 6, 2009 (internal release)_
  - Will not cross over different filesystems
  - Properly calculate the size of files regardless of environment
  - Widget needs to be “reset” after a sync
  - Major visual & animation enhancements
  - Warning dialog when deletions might occur
  - Actual name of Hard Drive is used
  - Resolved minor issue in sanitation of file paths

- **Version 1.2** — _February 2, 2009 (internal release)_
  - Now able to save a detailed output log
  - Date and time of last sync are now saved and shown
  - Sync-specific preference on the back are disabled during a sync
  - General visual enhancements
  - Fixed minor problem when multiple clicks to clear results during transition from back
  - Resolved minor visual problem when filenames contain special HTML entity codes

- **Version 1.1** — _January 15, 2009 (internal release)_
  - Widget now stretches to show results instead of in a dialog box
  - Resolved duplicate dialogs that occurred after a sync had been performed
  - Properly skips files that are newer in the destination whether mirroring is on or off
  - General visual enhancements

- **Version 1.0b** — _December 12, 2008 (private beta testing)_
  - Tooltips included for preference options
  - Uses rsync version 3.0.4 (to handle Mac OS X resource forks properly)
  - Common error codes determined
  - Automatically checks for updates

- **Version 0.7a** — _November 9, 2008 (internal release)_
  - Output log available
  - Path names properly sanitized
  - Confirmation dialog for when target folder might be erased
  - Drag & Drop disabled during a sync
  - File names are properly displayed
  - Validations when files are dropped (folders, multiple files)
