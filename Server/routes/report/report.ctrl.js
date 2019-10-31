const db = require('../../models');

exports.report = async (req, res, next) => {
    try {
        const report = await db.Report.create({
            UserId: req.user.id,
            content: req.body.content,
            title: req.body.title,
        });


        if (!report) {
            return res.status(403).send('신고X');
        }

        let file = req.files;
        if(Array.isArray(file)) {
          // Array
          file.forEach(async (fileElement) => {
            let url = (String)(fileElement.path).split('public');
            console.log(url);
            await db.ReportImage.create({
              src: url[1],
              ReportReportId: report.reportId,
            });
          });
          console.log(report);
          return res.status(200).json(report);
        } else {
            const file = await db.ReportImage.create({ 
                ProductId: product.id,
                src: file.path,
            })
        }

        console.log(report);
        return res.status(200).json(report);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.reportUp = async (req, res, next) => {
    try {
        const existReport = await db.Report.findOne({
            where: {
                reportId: req.params.id,
            }
        });

        if (!existReport) {
            return res.status(403).send('존재하지않는 신고내용입니다.');
        }

        await db.Report.update(
            {
                title: req.body.title,
                content: req.body.content,
            },
            {
                where: {
                    reportId: req.params.id,
                }
            }
        )
        .then(data => {
            console.log('신고내용 수정완료');
            return res.status(200).send('신고내용을 수정하였습니다.');  
        })
        .catch(err => {
            console.log(err);
            return res.status(404).send('신고내용 수정중 오류');
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.list = async (req, res, next) => {
    try {
        const reportList = await db.Report.findAll({
            where: {
                userId: req.user.id,
            },
            order: [['updateDay', 'desc']],
            include: [{
                "model": db.ReportImage,
            }]
        });

        if (reportList.length == 0) {
            return res.status(403).send('표시할 신고 내역이 없습니다.');
        }

        console.log(reportList);
        res.status(200).json(reportList);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.delete = async (req, res, next) => {
    try {
        const existReport = await db.Report.findOne({
            where: {
                reportId: req.params.id,
            }
        });

        if (!existReport) {
            res.status(403).send('존재하지않는 신고내용입니다.');
        }

        db.ReportImage.destroy({
            where: { 
                ReportReportId: req.params.id,
            }
        })
        .then(result => {
            console.log(result);
        })

        db.Report.destroy({
            where: {
                reportId: existReport.reportId,
            }
        })
        .then(async result => {
            console.log(result);
            console.log('신고내용 삭제완료.');
            return res.status(200).send('신고내용 삭제완료');
        })
        .catch(err => {
            console.log(err);
            return res.status(403).send('신고내용 삭제중 오류발생.')
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}